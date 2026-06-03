import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search, Building2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth, logAction } from "@/lib/auth";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ClienteFormDialog, type ClienteRow } from "@/components/cliente-form-dialog";
import { formatCNPJ, formatDate } from "@/lib/format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_app/clientes")({
  head: () => ({ meta: [{ title: "Clientes — DocFlow" }] }),
  component: ClientesPage,
});

function ClientesPage() {
  const auth = useAuth();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<ClienteRow | null>(null);
  const [open, setOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<ClienteRow | null>(null);

  const isAdmin = auth.role === "admin";

  const list = useQuery({
    queryKey: ["clientes", q],
    queryFn: async () => {
      let query = supabase.from("clientes").select("*").order("razao_social");
      if (q.trim()) {
        const term = `%${q.trim()}%`;
        query = query.or(
          `razao_social.ilike.${term},nome_fantasia.ilike.${term},cnpj.ilike.${term}`,
        );
      }
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleDelete = async () => {
    if (!delTarget?.id) return;
    const { error } = await supabase.from("clientes").delete().eq("id", delTarget.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await logAction({ acao: "delete", entidade: "cliente", registro_id: delTarget.id });
    toast.success("Cliente excluído");
    setDelTarget(null);
    qc.invalidateQueries({ queryKey: ["clientes"] });
  };

  return (
    <div>
      <PageHeader title="Clientes" description="Gerencie os clientes da sua organização.">
        {isAdmin && (
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Novo cliente
          </Button>
        )}
      </PageHeader>

      <Card className="p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por razão social, nome fantasia ou CNPJ…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1.4fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div>Cliente</div>
          <div>CNPJ</div>
          <div>Status</div>
          <div>Cadastrado</div>
          <div></div>
        </div>
        <div className="divide-y divide-border">
          {list.isLoading && (
            <div className="p-8 text-sm text-muted-foreground text-center">Carregando…</div>
          )}
          {!list.isLoading && (list.data?.length ?? 0) === 0 && (
            <div className="p-12 text-center">
              <Building2 className="h-10 w-10 mx-auto text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
            </div>
          )}
          {list.data?.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_1.4fr_1fr_1fr_auto] gap-2 md:gap-4 px-5 py-4 items-center hover:bg-accent/30 transition-colors"
            >
              <Link to="/clientes/$id" params={{ id: c.id }} className="min-w-0">
                <p className="font-medium truncate">{c.razao_social}</p>
                {c.nome_fantasia && (
                  <p className="text-xs text-muted-foreground truncate">{c.nome_fantasia}</p>
                )}
              </Link>
              <div className="text-sm text-muted-foreground">{formatCNPJ(c.cnpj)}</div>
              <div>
                <Badge
                  variant={c.status === "ativo" ? "default" : "secondary"}
                  className={
                    c.status === "ativo" ? "bg-success/15 text-success hover:bg-success/20" : ""
                  }
                >
                  {c.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">{formatDate(c.created_at)}</div>
              <div className="flex gap-1 justify-end">
                {isAdmin && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(c);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDelTarget(c)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {open && (
        <ClienteFormDialog
          open={open}
          onOpenChange={setOpen}
          cliente={editing}
          onSaved={() => qc.invalidateQueries({ queryKey: ["clientes"] })}
        />
      )}

      <AlertDialog open={!!delTarget} onOpenChange={(o) => !o && setDelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir <strong>{delTarget?.razao_social}</strong> e todos os documentos
              vinculados. Não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
