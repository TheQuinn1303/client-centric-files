import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, T as Textarea, d as DialogFooter } from "./textarea-CukKZpzi.mjs";
import { B as Button } from "./logo_simm-vNlDW5_s.mjs";
import { I as Input } from "./input-Lu1pg-xP.mjs";
import { L as Label } from "./label-BNMt_vRe.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B2j_DoaU.mjs";
import { s as supabase } from "./client-BveRGU8a.mjs";
import { l as logAction } from "./app-shell-Bar6R_4k.mjs";
import { a as Upload } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const ALLOWED = ["pdf", "docx", "xlsx", "png", "jpg", "jpeg", "txt"];
const MAX_BYTES = 25 * 1024 * 1024;
const schema = objectType({
  cliente_id: stringType().uuid("Selecione um cliente"),
  categoria_id: stringType().uuid().nullable().optional(),
  observacao: stringType().max(1e3).optional()
});
function UploadDocumentDialog({
  open,
  onOpenChange,
  clientes,
  categorias,
  defaultClienteId,
  versionOf,
  onUploaded
}) {
  const [clienteId, setClienteId] = reactExports.useState(
    versionOf?.cliente_id ?? defaultClienteId ?? ""
  );
  const [categoriaId, setCategoriaId] = reactExports.useState(versionOf?.categoria_id ?? "");
  const [observacao, setObservacao] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Selecione um arquivo");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Arquivo excede 25MB");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED.includes(ext)) {
      toast.error(`Formato .${ext} não permitido`);
      return;
    }
    const parsed = schema.safeParse({
      cliente_id: clienteId,
      categoria_id: categoriaId || null,
      observacao
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const uniq = `${crypto.randomUUID()}.${ext}`;
      const path = `${clienteId}/${uniq}`;
      const up = await supabase.storage.from("documentos").upload(path, file, {
        contentType: file.type || void 0
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
        created_by: user.id
      };
      const { data: ins, error: insErr } = await supabase.from("documentos").insert(insertPayload).select("id").single();
      if (insErr) throw insErr;
      await logAction({
        acao: versionOf ? "nova_versao" : "upload",
        entidade: "documento",
        registro_id: ins.id,
        detalhes: { nome: file.name, tamanho: file.size }
      });
      toast.success(versionOf ? "Nova versão enviada" : "Documento enviado");
      onUploaded?.();
      onOpenChange(false);
      setFile(null);
      setObservacao("");
      if (!versionOf) {
        setCategoriaId("");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: versionOf ? `Nova versão · ${versionOf.nome_original}` : "Enviar documento" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      !versionOf && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cliente *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: clienteId, onValueChange: setClienteId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecionar cliente…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: clientes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.razao_social }, c.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Categoria" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoriaId, onValueChange: setCategoriaId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sem categoria" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categorias.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.nome }, c.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Arquivo *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/30 p-6 cursor-pointer hover:bg-muted/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: file ? file.name : "Clique para selecionar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "PDF, DOCX, XLSX, PNG, JPG, TXT · até 25MB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "file",
              className: "hidden",
              accept: ".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.txt",
              onChange: (e) => setFile(e.target.files?.[0] ?? null)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Observação" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: observacao, onChange: (e) => setObservacao(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Enviando…" : "Enviar" })
      ] })
    ] })
  ] }) });
}
export {
  UploadDocumentDialog as U
};
