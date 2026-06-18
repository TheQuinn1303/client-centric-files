import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useQuery } from "./_libs/tanstack__react-query.mjs";
import { s as supabase } from "./_ssr/client-BveRGU8a.mjs";
import { u as useAuth, P as PageHeader } from "./_ssr/app-shell-Bar6R_4k.mjs";
import { C as Card } from "./_ssr/card-C_s2YeMp.mjs";
import { B as Button } from "./_ssr/logo_simm-vNlDW5_s.mjs";
import { f as formatDate, a as formatBytes } from "./_ssr/format-BRcv7AWB.mjs";
import { U as UploadDocumentDialog } from "./_ssr/upload-document-dialog-WgmfISgA.mjs";
import "./_libs/sonner.mjs";
import { a as Upload, c as Users, F as FileText, C as CalendarDays, T as TrendingUp } from "./_libs/lucide-react.mjs";
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
import "./_ssr/textarea-CukKZpzi.mjs";
import "./_ssr/input-Lu1pg-xP.mjs";
import "./_ssr/label-BNMt_vRe.mjs";
import "./_libs/radix-ui__react-label.mjs";
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
import "./_libs/zod.mjs";
function StatCard({
  icon: Icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-9 w-9 place-items-center rounded-md ${accent ?? "bg-primary/10 text-primary"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 font-display text-3xl font-semibold tracking-tight", children: value })
  ] });
}
function DashboardPage() {
  const auth = useAuth();
  const [uploadOpen, setUploadOpen] = reactExports.useState(false);
  const stats = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const since = /* @__PURE__ */ new Date();
      since.setDate(1);
      since.setHours(0, 0, 0, 0);
      const [cli, doc, mes, recent] = await Promise.all([supabase.from("clientes").select("id", {
        count: "exact",
        head: true
      }), supabase.from("documentos").select("id", {
        count: "exact",
        head: true
      }), supabase.from("documentos").select("id", {
        count: "exact",
        head: true
      }).gte("created_at", since.toISOString()), supabase.from("documentos").select("id, nome_original, tamanho, created_at, cliente:clientes(id, razao_social), categoria:categorias(nome)").order("created_at", {
        ascending: false
      }).limit(8)]);
      return {
        clientes: cli.count ?? 0,
        documentos: doc.count ?? 0,
        mes: mes.count ?? 0,
        recent: recent.data ?? []
      };
    }
  });
  const clientes = useQuery({
    queryKey: ["clientes-min"],
    queryFn: async () => (await supabase.from("clientes").select("id, razao_social").order("razao_social")).data ?? []
  });
  const categorias = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("id, nome").order("nome")).data ?? []
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Dashboard - Simm Docs", description: "Visão geral do sistema." }),
      auth.role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setUploadOpen(true), className: "w-full sm:w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
        "Enviar documento"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: "Clientes", value: stats.data?.clientes ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: FileText, label: "Documentos", value: stats.data?.documentos ?? "—", accent: "bg-success/10 text-success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CalendarDays, label: "Enviados no mês", value: stats.data?.mes ?? "—", accent: "bg-warning/15 text-warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: TrendingUp, label: "Atividade", value: stats.data?.recent.length ?? "—", accent: "bg-accent text-accent-foreground" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6 p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: "Últimos documentos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Os arquivos mais recentes adicionados ao sistema." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
        (stats.data?.recent ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "Nenhum documento ainda." }),
        stats.data?.recent.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/clientes/$id", params: {
          id: d.cliente?.id ?? ""
        }, className: "flex items-center gap-4 p-4 hover:bg-accent/40 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: d.nome_original }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
              d.cliente?.razao_social ?? "—",
              " · ",
              d.categoria?.nome ?? "Sem categoria"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-xs text-muted-foreground shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: formatDate(d.created_at) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: formatBytes(d.tamanho) })
          ] })
        ] }, d.id))
      ] })
    ] }),
    clientes.data && categorias.data && /* @__PURE__ */ jsxRuntimeExports.jsx(UploadDocumentDialog, { open: uploadOpen, onOpenChange: setUploadOpen, clientes: clientes.data, categorias: categorias.data })
  ] });
}
export {
  DashboardPage as component
};
