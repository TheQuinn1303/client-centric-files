import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowLeft, Building2, Download, FileText, History, Pencil,
  Plus, Trash2, GitBranch, Mail, Phone, User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth, logAction } from "@/lib/auth";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBytes, formatCNPJ, formatDate, formatDateTime } from "@/lib/format";
import { ClienteFormDialog } from "@/components/cliente-form-dialog";
import { UploadDocumentDialog } from "@/components/upload-document-dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_app/clientes/$id")({
  head: () => ({ meta: [{ title: "Cliente — DocFlow" }] }),
  component: ClienteDetail,
});

function ClienteDetail() {
  const { id } = useParams({ from: "/_app/clientes/$id" });
  const auth = useAuth();
  const qc = useQueryClient();
  const isAdmin = auth.role === "admin";
  const [editOpen, setEditOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [versionOf, setVersionOf] = useState<any>(null);
  const [delDoc, setDelDoc] = useState<any>(null);

  const cliente = useQuery({
    queryKey: ["cliente", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const docs = useQuery({
    queryKey: ["cliente-docs", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documentos")
        .select("*, categoria:categorias(nome)")
        .eq("cliente_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const logs = useQuery({
    queryKey: ["cliente-logs", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("logs").select("*")
        .eq("registro_id", id).order("data_hora", { ascending: false }).limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const categorias = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const { data } = await supabase.from("categorias").select("id, nome").order("nome");
      return data ?? [];
    },
  });

  const download = async (d: any) => {
    const { data, error } = await supabase.storage.from("documentos").createSignedUrl(d.caminho_storage, 60);
    if (error) { toast.error(error.message); return; }
    await logAction({ acao: "download", entidade: "documento", registro_id: d.id });
    window.open(data.signedUrl, "_blank");
  };

  const handleDelDoc = async () => {
    if (!delDoc) return;
    await supabase.storage.from("documentos").remove([delDoc.caminho_storage]);
    const { error } = await supabase.from("documentos").delete().eq("id", delDoc.id);
    if (error) { toast.error(error.message); return; }
    await logAction({ acao: "delete", entidade: "documento", registro_id: delDoc.id });
    toast.success("Documento excluído");
    setDelDoc(null);
    qc.invalidateQueries({ queryKey: ["cliente-docs", id] });
  };

  if (cliente.isLoading) return <div className="text-sm text-muted-foreground">Carregando…</div>;
  if (!cliente.data) return <div className="text-sm text-muted-foreground">Cliente não encontrado.</div>;

  const c = cliente.data;

  return (
    <div>
      <Link to="/clientes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <PageHeader title={c.razao_social} description={c.nome_fantasia ?? undefined}>
        {isAdmin && (
          <>
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4 mr-1" /> Editar
            </Button>
            <Button onClick={() => { setVersionOf(null); setUploadOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Documento
            </Button>
          </>
        )}
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 space-y-4 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <Badge className={c.status === "ativo" ? "bg-success/15 text-success" : ""}>{c.status}</Badge>
          </div>
          <dl className="space-y-3 text-sm">
            <Field label="CNPJ" value={formatCNPJ(c.cnpj)} />
            <Field label="E-mail" value={c.email ?? "—"} icon={Mail} />
            <Field label="Telefone" value={c.telefone ?? "—"} icon={Phone} />
            <Field label="Responsável" value={c.responsavel ?? "—"} icon={UserIcon} />
            <Field label="Cadastrado em" value={formatDate(c.created_at)} />
          </dl>
          {c.observacoes && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Observações</p>
              <p className="text-sm whitespace-pre-wrap">{c.observacoes}</p>
            </div>
          )}
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="docs">
            <TabsList>
              <TabsTrigger value="docs"><FileText className="h-4 w-4 mr-1" /> Documentos</TabsTrigger>
              <TabsTrigger value="logs"><History className="h-4 w-4 mr-1" /> Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="docs">
              <Card className="overflow-hidden">
                <div className="divide-y divide-border">
                  {(docs.data?.length ?? 0) === 0 && (
                    <div className="p-10 text-center text-sm text-muted-foreground">Nenhum documento.</div>
                  )}
                  {docs.data?.map((d: any) => (
                    <div key={d.id} className="flex items-center gap-3 p-4 hover:bg-accent/30">
                      <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary shrink-0 uppercase text-xs font-semibold">
                        {d.tipo_arquivo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{d.nome_original}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {d.categoria?.nome ?? "Sem categoria"} · v{d.versao} · {formatBytes(d.tamanho)} · {formatDate(d.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => download(d)} title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <>
                            <Button variant="ghost" size="icon" title="Nova versão" onClick={() => { setVersionOf(d); setUploadOpen(true); }}>
                              <GitBranch className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDelDoc(d)} title="Excluir">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="logs">
              <Card className="overflow-hidden">
                <div className="divide-y divide-border">
                  {(logs.data?.length ?? 0) === 0 && (
                    <div className="p-10 text-center text-sm text-muted-foreground">Sem atividade registrada.</div>
                  )}
                  {logs.data?.map((l) => (
                    <div key={l.id} className="p-4 text-sm">
                      <div className="flex justify-between gap-3">
                        <span><strong>{l.usuario_nome ?? "—"}</strong> · {l.acao}</span>
                        <span className="text-xs text-muted-foreground">{formatDateTime(l.data_hora)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {editOpen && (
        <ClienteFormDialog
          open={editOpen} onOpenChange={setEditOpen}
          cliente={c}
          onSaved={() => qc.invalidateQueries({ queryKey: ["cliente", id] })}
        />
      )}
      {uploadOpen && (
        <UploadDocumentDialog
          open={uploadOpen} onOpenChange={setUploadOpen}
          clientes={[{ id: c.id, razao_social: c.razao_social }]}
          categorias={categorias.data ?? []}
          defaultClienteId={c.id}
          versionOf={versionOf}
          onUploaded={() => qc.invalidateQueries({ queryKey: ["cliente-docs", id] })}
        />
      )}
      <AlertDialog open={!!delDoc} onOpenChange={(o) => !o && setDelDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
            <AlertDialogDescription>{delDoc?.nome_original}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelDoc} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Mail }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
