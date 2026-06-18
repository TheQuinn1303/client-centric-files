import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { s as supabase } from "./_ssr/client-BveRGU8a.mjs";
import { u as useAuth, P as PageHeader, l as logAction } from "./_ssr/app-shell-Bar6R_4k.mjs";
import { C as Card } from "./_ssr/card-C_s2YeMp.mjs";
import { B as Button } from "./_ssr/logo_simm-vNlDW5_s.mjs";
import { I as Input } from "./_ssr/input-Lu1pg-xP.mjs";
import { B as Badge } from "./_ssr/badge-DBmn46xX.mjs";
import { C as ClienteFormDialog, A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./_ssr/alert-dialog-DXniyDs0.mjs";
import { b as formatCNPJ, f as formatDate } from "./_ssr/format-BRcv7AWB.mjs";
import { P as Plus, b as Search, B as Building2, d as Pencil, e as Trash2 } from "./_libs/lucide-react.mjs";
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
import "./_ssr/label-BNMt_vRe.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_ssr/textarea-CukKZpzi.mjs";
import "./_ssr/select-B2j_DoaU.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
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
function ClientesPage() {
  const auth = useAuth();
  const qc = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [delTarget, setDelTarget] = reactExports.useState(null);
  const isAdmin = auth.role === "admin";
  const list = useQuery({
    queryKey: ["clientes", q],
    queryFn: async () => {
      let query = supabase.from("clientes").select("*").order("razao_social");
      if (q.trim()) {
        const term = `%${q.trim()}%`;
        query = query.or(`razao_social.ilike.${term},nome_fantasia.ilike.${term},cnpj.ilike.${term}`);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data ?? [];
    }
  });
  const handleDelete = async () => {
    if (!delTarget?.id) return;
    const {
      error
    } = await supabase.from("clientes").delete().eq("id", delTarget.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await logAction({
      acao: "delete",
      entidade: "cliente",
      registro_id: delTarget.id
    });
    toast.success("Cliente excluído");
    setDelTarget(null);
    qc.invalidateQueries({
      queryKey: ["clientes"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Clientes", description: "Gerencie os clientes da sua organização.", children: isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
      setEditing(null);
      setOpen(true);
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
      " Novo cliente"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Buscar por razão social, nome fantasia ou CNPJ…", value: q, onChange: (e) => setQ(e.target.value), className: "pl-9" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid grid-cols-[2fr_1.4fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Cliente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "CNPJ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Cadastrado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
        list.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-sm text-muted-foreground text-center", children: "Carregando…" }),
        !list.isLoading && (list.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-10 w-10 mx-auto text-muted-foreground/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Nenhum cliente encontrado." })
        ] }),
        list.data?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[2fr_1.4fr_1fr_1fr_auto] gap-2 md:gap-4 px-5 py-4 items-center hover:bg-accent/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/clientes/$id", params: {
            id: c.id
          }, className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: c.razao_social }),
            c.nome_fantasia && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: c.nome_fantasia })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: formatCNPJ(c.cnpj) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: c.status === "ativo" ? "default" : "secondary", className: c.status === "ativo" ? "bg-success/15 text-success hover:bg-success/20" : "", children: c.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: formatDate(c.created_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 justify-end", children: isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
              setEditing(c);
              setOpen(true);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => setDelTarget(c), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
          ] }) })
        ] }, c.id))
      ] })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(ClienteFormDialog, { open, onOpenChange: setOpen, cliente: editing, onSaved: () => qc.invalidateQueries({
      queryKey: ["clientes"]
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!delTarget, onOpenChange: (o) => !o && setDelTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir cliente?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "Esta ação irá excluir ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: delTarget?.razao_social }),
          " e todos os documentos vinculados. Não pode ser desfeita."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handleDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Excluir" })
      ] })
    ] }) })
  ] });
}
export {
  ClientesPage as component
};
