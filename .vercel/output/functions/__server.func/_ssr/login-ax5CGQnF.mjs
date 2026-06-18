import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BveRGU8a.mjs";
import { l as logoSimm, B as Button } from "./logo_simm-vNlDW5_s.mjs";
import { I as Input } from "./input-Lu1pg-xP.mjs";
import { L as Label } from "./label-BNMt_vRe.mjs";
import { C as Card } from "./card-C_s2YeMp.mjs";
import { L as LoaderCircle } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
const schema = objectType({
  email: stringType().email("E-mail inválido").max(255),
  password: stringType().min(6, "Senha deve ter ao menos 6 caracteres").max(72),
  nome: stringType().trim().min(2).max(100).optional()
});
function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = reactExports.useState("login");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [nome, setNome] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) navigate({
        to: "/dashboard",
        replace: true
      });
    });
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({
        to: "/dashboard",
        replace: true
      });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);
  const handle = async (e) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      email,
      password,
      nome: mode === "signup" ? nome : void 0
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nome
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        if (error) throw error;
        toast.success("Conta criada! Faça login.");
        setMode("login");
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha na autenticação");
    } finally {
      setLoading(false);
    }
  };
  const appSettings = useQuery({
    queryKey: ["appSettings"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("app_settings").select("logo_url").single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    staleTime: Infinity
    // As configurações da aplicação não mudam com frequência
  });
  const logoUrl = reactExports.useMemo(() => appSettings.data?.logo_url, [appSettings.data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-[#02347c] via-[#054a91] to-[#b6dbf4]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-col justify-between p-12 text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 font-display text-lg font-semibold text-white", children: [
        logoUrl ? (
          // Se houver uma URL de logo, use a imagem
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoUrl, alt: "Logo DocFlow", className: "h-9 w-auto object-contain" })
        ) : (
          // Caso contrário, use a imagem local do Plano A
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoSimm, alt: "Simm Computadores", className: "h-10 w-auto object-contain brightness-0 invert" })
        ),
        "Simm Computadores Documentação"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl font-bold tracking-tight leading-tight", children: "Centralização de documentos SIMM Computadores." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80", children: "Substuisão das pasta da documentação do servidor pra um sistema moderno de armazenamento, busca e auditoria — tudo em um só lugar." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/60", children: [
        " © ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Simm Computadores"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-6 bg-white/5 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md p-8 space-y-6 bg-white/95 shadow-2xl border-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold", children: mode === "login" ? "Entrar" : "Criar conta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: mode === "login" ? "Acesse sua conta para gerenciar documentos." : "O primeiro usuário cadastrado se torna administrador." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handle, className: "space-y-4", children: [
        mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome", children: "Nome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "nome", value: nome, onChange: (e) => setNome(e.target.value), placeholder: "Seu nome" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "E-mail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "voce@empresa.com", autoComplete: "email" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Senha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", autoComplete: mode === "login" ? "current-password" : "new-password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "w-full", disabled: loading, children: [
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          mode === "login" ? "Entrar" : "Criar conta"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground", children: mode === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "Não tem conta?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("signup"), className: "text-primary font-medium hover:underline", children: "Cadastre-se" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "Já tem conta?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("login"), className: "text-primary font-medium hover:underline", children: "Entrar" })
      ] }) })
    ] }) })
  ] });
}
export {
  LoginPage as component
};
