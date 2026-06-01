import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Upload as UploadIcon } from "lucide-react";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { logAction } from "@/lib/auth";

const ALLOWED = ["pdf", "docx", "xlsx", "png", "jpg", "jpeg", "txt"];
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

const schema = z.object({
  cliente_id: z.string().uuid("Selecione um cliente"),
  categoria_id: z.string().uuid().nullable().optional(),
  observacao: z.string().max(1000).optional(),
});

export interface UploadDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  clientes: { id: string; razao_social: string }[];
  categorias: { id: string; nome: string }[];
  defaultClienteId?: string;
  /** If set, new doc will be a new version of the given doc id */
  versionOf?: { id: string; nome_original: string; cliente_id: string; categoria_id: string | null; versao: number } | null;
  onUploaded?: () => void;
}

export function UploadDocumentDialog({
  open, onOpenChange, clientes, categorias, defaultClienteId, versionOf, onUploaded,
}: UploadDialogProps) {
  const [clienteId, setClienteId] = useState<string>(versionOf?.cliente_id ?? defaultClienteId ?? "");
  const [categoriaId, setCategoriaId] = useState<string>(versionOf?.categoria_id ?? "");
  const [observacao, setObservacao] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Selecione um arquivo"); return; }
    if (file.size > MAX_BYTES) { toast.error("Arquivo excede 25MB"); return; }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED.includes(ext)) { toast.error(`Formato .${ext} não permitido`); return; }

    const parsed = schema.safeParse({
      cliente_id: clienteId,
      categoria_id: categoriaId || null,
      observacao,
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }

    setBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const uniq = `${crypto.randomUUID()}.${ext}`;
      const path = `${clienteId}/${uniq}`;
      const up = await supabase.storage.from("documentos").upload(path, file, {
        contentType: file.type || undefined,
      });
      if (up.error) throw up.error;

      const insertPayload = {
        cliente_id: clienteId,
        categoria_id: parsed.data.categoria_id ?? null,
        nome_arquivo: uniq,
        nome_original: versionOf?.nome_original ?? file.name,
        tipo_arquivo: ext,
        tamanho: file.size,
        caminho_storage: path,
        versao: versionOf ? versionOf.versao + 1 : 1,
        documento_pai_id: versionOf?.id ?? null,
        observacao: observacao || null,
        created_by: user.id,
      };
      const { data: ins, error: insErr } = await supabase
        .from("documentos").insert(insertPayload).select("id").single();
      if (insErr) throw insErr;

      await logAction({
        acao: versionOf ? "nova_versao" : "upload",
        entidade: "documento",
        registro_id: ins.id,
        detalhes: { nome: file.name, tamanho: file.size },
      });

      toast.success(versionOf ? "Nova versão enviada" : "Documento enviado");
      onUploaded?.();
      onOpenChange(false);
      setFile(null); setObservacao(""); if (!versionOf) { setCategoriaId(""); }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {versionOf ? `Nova versão · ${versionOf.nome_original}` : "Enviar documento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {!versionOf && (
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger><SelectValue placeholder="Selecionar cliente…" /></SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.razao_social}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger><SelectValue placeholder="Sem categoria" /></SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Arquivo *</Label>
            <label className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/30 p-6 cursor-pointer hover:bg-muted/50 transition-colors">
              <UploadIcon className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">{file ? file.name : "Clique para selecionar"}</span>
              <span className="text-xs text-muted-foreground">PDF, DOCX, XLSX, PNG, JPG, TXT · até 25MB</span>
              <Input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.txt"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <div className="space-y-2">
            <Label>Observação</Label>
            <Textarea rows={2} value={observacao} onChange={(e) => setObservacao(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={busy}>{busy ? "Enviando…" : "Enviar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
