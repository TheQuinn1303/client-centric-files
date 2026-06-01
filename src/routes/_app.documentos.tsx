import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download, FileText, Search } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { logAction } from "@/lib/auth";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatBytes, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_app/documentos")({
  head: () => ({ meta: [{ title: "Documentos — DocFlow" }] }),
  component: DocumentosPage,
});

function DocumentosPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [cliId, setCliId] = useState<string>("all");

  const categorias = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("id, nome").order("nome")).data ?? [],
  });
  const clientes = useQuery({
    queryKey: ["clientes-min"],
    queryFn: async () => (await supabase.from("clientes").select("id, razao_social").order("razao_social")).data ?? [],
  });

  const list = useQuery({
    queryKey: ["all-docs", q, cat, cliId],
    queryFn: async () => {
      let query = supabase
        .from("documentos")
        .select("*, cliente:clientes(id, razao_social, cnpj), categoria:categorias(id, nome), profile:profiles!documentos_created_by_fkey(nome)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (q.trim()) query = query.ilike("nome_original", `%${q.trim()}%`);
      if (cat !== "all") query = query.eq("categoria_id", cat);
      if (cliId !== "all") query = query.eq("cliente_id", cliId);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const download = async (d: any) => {
    const { data, error } = await supabase.storage.from("documentos").createSignedUrl(d.caminho_storage, 60);
    if (error) { toast.error(error.message); return; }
    await logAction({ acao: "download", entidade: "documento", registro_id: d.id });
    window.open(data.signedUrl, "_blank");
  };

  return (
    <div>
      <PageHeader title="Documentos" description="Busca global em todos os documentos do sistema." />

      <Card className="p-4 mb-4 grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pelo nome do documento…" className="pl-9" />
        </div>
        <Select value={cliId} onValueChange={setCliId}>
          <SelectTrigger><SelectValue placeholder="Cliente" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {clientes.data?.map((c) => <SelectItem key={c.id} value={c.id}>{c.razao_social}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categorias.data?.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div>Documento</div>
          <div>Cliente</div>
          <div>Categoria</div>
          <div>Enviado por</div>
          <div>Data</div>
          <div></div>
        </div>
        <div className="divide-y divide-border">
          {list.isLoading && <div className="p-8 text-center text-sm text-muted-foreground">Carregando…</div>}
          {!list.isLoading && (list.data?.length ?? 0) === 0 && (
            <div className="p-12 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">Nenhum documento encontrado.</p>
            </div>
          )}
          {list.data?.map((d: any) => (
            <div key={d.id} className="grid grid-cols-1 md:grid-cols-[2fr_1.4fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-5 py-4 items-center">
              <div className="min-w-0 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary text-[10px] uppercase font-semibold shrink-0">
                  {d.tipo_arquivo}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{d.nome_original}</p>
                  <p className="text-xs text-muted-foreground">v{d.versao} · {formatBytes(d.tamanho)}</p>
                </div>
              </div>
              <Link to="/clientes/$id" params={{ id: d.cliente?.id }} className="text-sm hover:underline truncate">
                {d.cliente?.razao_social}
              </Link>
              <div className="text-sm text-muted-foreground">{d.categoria?.nome ?? "—"}</div>
              <div className="text-sm text-muted-foreground truncate">{d.profile?.nome ?? "—"}</div>
              <div className="text-sm text-muted-foreground">{formatDate(d.created_at)}</div>
              <div className="text-right">
                <Button variant="ghost" size="icon" onClick={() => download(d)}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
