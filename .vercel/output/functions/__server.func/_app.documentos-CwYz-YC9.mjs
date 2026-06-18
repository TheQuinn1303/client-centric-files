import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { s as supabase } from "./_ssr/client-BveRGU8a.mjs";
import { P as PageHeader, l as logAction } from "./_ssr/app-shell-Bar6R_4k.mjs";
import { C as Card } from "./_ssr/card-C_s2YeMp.mjs";
import { I as Input } from "./_ssr/input-Lu1pg-xP.mjs";
import { B as Button } from "./_ssr/logo_simm-vNlDW5_s.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./_ssr/select-B2j_DoaU.mjs";
import { a as formatBytes, f as formatDate } from "./_ssr/format-BRcv7AWB.mjs";
import { b as Search, F as FileText, D as Download } from "./_libs/lucide-react.mjs";
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
function DocumentosPage() {
  const [q, setQ] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("all");
  const [cliId, setCliId] = reactExports.useState("all");
  const categorias = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("id, nome").order("nome")).data ?? []
  });
  const clientes = useQuery({
    queryKey: ["clientes-min"],
    queryFn: async () => (await supabase.from("clientes").select("id, razao_social").order("razao_social")).data ?? []
  });
  const list = useQuery({
    queryKey: ["all-docs", q, cat, cliId],
    queryFn: async () => {
      let query = supabase.from("documentos").select(`
          *,
          cliente:clientes(id, razao_social, cnpj),
          categoria:categorias(id, nome)
        `).order("created_at", {
        ascending: false
      }).limit(200);
      if (q.trim()) query = query.ilike("nome_original", `%${q.trim()}%`);
      if (cat !== "all") query = query.eq("categoria_id", cat);
      if (cliId !== "all") query = query.eq("cliente_id", cliId);
      const {
        data: docs,
        error: docsError
      } = await query;
      if (docsError) throw docsError;
      if (!docs || docs.length === 0) return [];
      const userIds = Array.from(new Set(docs.map((d) => d.created_by).filter(Boolean)));
      if (userIds.length > 0) {
        const {
          data: profiles
        } = await supabase.from("profiles").select("id, nome").in("id", userIds);
        if (profiles) {
          const profileMap = new Map(profiles.map((p) => [p.id, p.nome]));
          return docs.map((d) => ({
            ...d,
            profile: {
              nome: profileMap.get(d.created_by) || "Sistema"
            }
          }));
        }
      }
      return docs.map((d) => ({
        ...d,
        profile: null
      }));
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Documentos", description: "Busca global em todos os documentos do sistema." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 mb-4 grid gap-3 md:grid-cols-[2fr_1fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar pelo nome do documento…", className: "pl-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: cliId, onValueChange: setCliId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Cliente" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Todos os clientes" }),
          clientes.data?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.razao_social }, c.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: cat, onValueChange: setCat, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Categoria" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Todas as categorias" }),
          categorias.data?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.nome }, c.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Documento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Cliente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Categoria" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Enviado por" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Data" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
        list.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "Carregando…" }),
        !list.isLoading && (list.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 mx-auto text-muted-foreground/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Nenhum documento encontrado." })
        ] }),
        list.data?.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[2fr_1.4fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-5 py-4 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary text-[10px] uppercase font-semibold shrink-0", children: d.tipo_arquivo }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: d.nome_original }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "v",
                d.versao,
                " · ",
                formatBytes(d.tamanho)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/clientes/$id", params: {
            id: d.cliente?.id
          }, className: "text-sm hover:underline truncate", children: d.cliente?.razao_social }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: d.categoria?.nome ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground truncate", children: d.profile?.nome ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: formatDate(d.created_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => download(d), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }) }) })
        ] }, d.id))
      ] })
    ] })
  ] });
}
export {
  DocumentosPage as component
};
