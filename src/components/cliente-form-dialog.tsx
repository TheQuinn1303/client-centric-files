import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { logAction } from "@/lib/auth";

const schema = z.object({
  razao_social: z.string().trim().min(2, "Razão social obrigatória").max(255),
  nome_fantasia: z.string().trim().max(255).optional().or(z.literal("")),
  cnpj: z.string().trim().max(20).optional().or(z.literal("")),
  email: z.string().trim().email("E-mail inválido").max(255).optional().or(z.literal("")),
  telefone: z.string().trim().max(30).optional().or(z.literal("")),
  responsavel: z.string().trim().max(150).optional().or(z.literal("")),
  observacoes: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["ativo", "inativo"]),
});

export interface ClienteRow {
  id?: string;
  razao_social?: string;
  nome_fantasia?: string | null;
  cnpj?: string | null;
  email?: string | null;
  telefone?: string | null;
  responsavel?: string | null;
  observacoes?: string | null;
  status?: "ativo" | "inativo";
}

export function ClienteFormDialog({
  open, onOpenChange, cliente, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cliente?: ClienteRow | null;
  onSaved?: () => void;
}) {
  const isEdit = !!cliente?.id;
  const [form, setForm] = useState<ClienteRow>({
    razao_social: cliente?.razao_social ?? "",
    nome_fantasia: cliente?.nome_fantasia ?? "",
    cnpj: cliente?.cnpj ?? "",
    email: cliente?.email ?? "",
    telefone: cliente?.telefone ?? "",
    responsavel: cliente?.responsavel ?? "",
    observacoes: cliente?.observacoes ?? "",
    status: cliente?.status ?? "ativo",
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ClienteRow>(k: K, v: ClienteRow[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSaving(true);
    try {
      const payload = {
        razao_social: parsed.data.razao_social,
        nome_fantasia: parsed.data.nome_fantasia || null,
        cnpj: parsed.data.cnpj || null,
        email: parsed.data.email || null,
        telefone: parsed.data.telefone || null,
        responsavel: parsed.data.responsavel || null,
        observacoes: parsed.data.observacoes || null,
        status: parsed.data.status,
      };
      if (isEdit && cliente?.id) {
        const { error } = await supabase.from("clientes").update(payload).eq("id", cliente.id);
        if (error) throw error;
        await logAction({ acao: "update", entidade: "cliente", registro_id: cliente.id });
        toast.success("Cliente atualizado");
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from("clientes").insert({ ...payload, created_by: user?.id }).select("id").single();
        if (error) throw error;
        await logAction({ acao: "create", entidade: "cliente", registro_id: data.id });
        toast.success("Cliente cadastrado");
      }
      onOpenChange(false);
      onSaved?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar cliente" : "Novo cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Razão Social *</Label>
            <Input value={form.razao_social ?? ""} onChange={(e) => set("razao_social", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Nome Fantasia</Label>
            <Input value={form.nome_fantasia ?? ""} onChange={(e) => set("nome_fantasia", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>CNPJ</Label>
            <Input value={form.cnpj ?? ""} onChange={(e) => set("cnpj", e.target.value)} placeholder="00.000.000/0000-00" />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={form.telefone ?? ""} onChange={(e) => set("telefone", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Responsável</Label>
            <Input value={form.responsavel ?? ""} onChange={(e) => set("responsavel", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as "ativo" | "inativo")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Observações</Label>
            <Textarea rows={3} value={form.observacoes ?? ""} onChange={(e) => set("observacoes", e.target.value)} />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
