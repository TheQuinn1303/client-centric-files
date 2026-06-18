import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useParams, L as Link } from "./_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { s as supabase } from "./_ssr/client-BveRGU8a.mjs";
import { u as useAuth, P as PageHeader, l as logAction } from "./_ssr/app-shell-Bar6R_4k.mjs";
import { C as Card } from "./_ssr/card-C_s2YeMp.mjs";
import { B as Button, c as cn } from "./_ssr/logo_simm-vNlDW5_s.mjs";
import { B as Badge } from "./_ssr/badge-DBmn46xX.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "./_libs/radix-ui__react-tabs.mjs";
import { b as formatCNPJ, f as formatDate, a as formatBytes, c as formatDateTime } from "./_ssr/format-BRcv7AWB.mjs";
import { C as ClienteFormDialog, A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./_ssr/alert-dialog-DXniyDs0.mjs";
import { U as UploadDocumentDialog } from "./_ssr/upload-document-dialog-WgmfISgA.mjs";
import { A as ArrowLeft, d as Pencil, P as Plus, B as Building2, M as Mail, f as Phone, U as User, F as FileText, H as History, D as Download, G as GitBranch, e as Trash2 } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/radix-ui__react-avatar.mjs";
import "./_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./_libs/use-sync-external-store.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_ssr/input-Lu1pg-xP.mjs";
import "./_ssr/label-BNMt_vRe.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_ssr/textarea-CukKZpzi.mjs";
import "./_ssr/select-B2j_DoaU.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/radix-ui__react-alert-dialog.mjs";
import "./_libs/zod.mjs";
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
function ClienteDetail() {
  const {
    id
  } = useParams({
    from: "/_app/clientes/$id"
  });
  const auth = useAuth();
  const qc = useQueryClient();
  const isAdmin = auth.role === "admin";
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [uploadOpen, setUploadOpen] = reactExports.useState(false);
  const [versionOf, setVersionOf] = reactExports.useState(null);
  const [delDoc, setDelDoc] = reactExports.useState(null);
  const cliente = useQuery({
    queryKey: ["cliente", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("clientes").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    }
  });
  const docs = useQuery({
    queryKey: ["cliente-docs", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("documentos").select("*, categoria:categorias(nome)").eq("cliente_id", id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const logs = useQuery({
    queryKey: ["cliente-logs", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("logs").select("*").eq("registro_id", id).order("data_hora", {
        ascending: false
      }).limit(50);
      if (error) throw error;
      return data ?? [];
    }
  });
  const categorias = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("categorias").select("id, nome").order("nome");
      return data ?? [];
    }
  });
  const download = async (d) => {
    const {
      data,
      error
    } = await supabase.storage.from("documentos").createSignedUrl(d.caminho_storage, 60);
    if (error) {
      toast.error(error.message);
      return;
    }
    await logAction({
      acao: "download",
      entidade: "documento",
      registro_id: d.id
    });
    window.open(data.signedUrl, "_blank");
  };
  const handleDelDoc = async () => {
    if (!delDoc) return;
    await supabase.storage.from("documentos").remove([delDoc.caminho_storage]);
    const {
      error
    } = await supabase.from("documentos").delete().eq("id", delDoc.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await logAction({
      acao: "delete",
      entidade: "documento",
      registro_id: delDoc.id
    });
    toast.success("Documento excluído");
    setDelDoc(null);
    qc.invalidateQueries({
      queryKey: ["cliente-docs", id]
    });
  };
  if (cliente.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Carregando…" });
  if (!cliente.data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Cliente não encontrado." });
  const c = cliente.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/clientes", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Voltar"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: c.razao_social, description: c.nome_fantasia ?? void 0, children: isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setEditOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4 mr-1" }),
        " Editar"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
        setVersionOf(null);
        setUploadOpen(true);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
        " Documento"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 space-y-4 lg:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: c.status === "ativo" ? "bg-success/15 text-success" : "", children: c.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "CNPJ", value: formatCNPJ(c.cnpj) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "E-mail", value: c.email ?? "—", icon: Mail }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Telefone", value: c.telefone ?? "—", icon: Phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Responsável", value: c.responsavel ?? "—", icon: User }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Cadastrado em", value: formatDate(c.created_at) })
        ] }),
        c.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Observações" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap", children: c.observacoes })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "docs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "docs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-1" }),
            " Documentos"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "logs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 mr-1" }),
            " Histórico"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "docs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
          (docs.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "Nenhum documento." }),
          docs.data?.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 hover:bg-accent/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary shrink-0 uppercase text-xs font-semibold", children: d.tipo_arquivo }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: d.nome_original }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                d.categoria?.nome ?? "Sem categoria",
                " · v",
                d.versao,
                " ·",
                " ",
                formatBytes(d.tamanho),
                " · ",
                formatDate(d.created_at)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => download(d), title: "Download", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }) }),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", title: "Nova versão", onClick: () => {
                  setVersionOf(d);
                  setUploadOpen(true);
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(GitBranch, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => setDelDoc(d), title: "Excluir", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
              ] })
            ] })
          ] }, d.id))
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "logs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
          (logs.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "Sem atividade registrada." }),
          logs.data?.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: l.usuario_nome ?? "—" }),
              " · ",
              l.acao
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatDateTime(l.data_hora) })
          ] }) }, l.id))
        ] }) }) })
      ] }) })
    ] }),
    editOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(ClienteFormDialog, { open: editOpen, onOpenChange: setEditOpen, cliente: c, onSaved: () => qc.invalidateQueries({
      queryKey: ["cliente", id]
    }) }),
    uploadOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(UploadDocumentDialog, { open: uploadOpen, onOpenChange: setUploadOpen, clientes: [{
      id: c.id,
      razao_social: c.razao_social
    }], categorias: categorias.data ?? [], defaultClienteId: c.id, versionOf, onUploaded: () => qc.invalidateQueries({
      queryKey: ["cliente-docs", id]
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!delDoc, onOpenChange: (o) => !o && setDelDoc(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir documento?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: delDoc?.nome_original })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handleDelDoc, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Excluir" })
      ] })
    ] }) })
  ] });
}
function Field({
  label,
  value,
  icon: Icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dt", { className: "text-muted-foreground flex items-center gap-1.5", children: [
      Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-right font-medium", children: value })
  ] });
}
export {
  ClienteDetail as component
};
