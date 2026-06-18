import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link, f as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-BveRGU8a.mjs";
import { l as logoSimm, B as Button, c as cn } from "./logo_simm-vNlDW5_s.mjs";
import { R as Root, b as Trigger, P as Portal, C as Content, a as Close, O as Overlay, T as Title, D as Description } from "../_libs/radix-ui__react-dialog.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { R as Root$1, F as Fallback, I as Image } from "../_libs/radix-ui__react-avatar.mjs";
import { b as Search, j as Menu, k as LayoutDashboard, c as Users, F as FileText, a as Upload, l as Settings, m as LogOut, X } from "../_libs/lucide-react.mjs";
function useAuth() {
  const [state, setState] = reactExports.useState({
    loading: true,
    user: null,
    role: null,
    nome: null
  });
  reactExports.useEffect(() => {
    let mounted = true;
    const load = async (user) => {
      if (!user) {
        if (mounted) setState({ loading: false, user: null, role: null, nome: null });
        return;
      }
      const [roleRes, profRes] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
        supabase.from("profiles").select("nome").eq("id", user.id).maybeSingle()
      ]);
      if (!mounted) return;
      setState({
        loading: false,
        user,
        role: roleRes.data?.role ?? "usuario",
        nome: profRes.data?.nome ?? user.email ?? null
      });
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      load(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => load(data.session?.user ?? null));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return state;
}
async function logAction(opts) {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data: prof } = await supabase.from("profiles").select("nome").eq("id", user.id).maybeSingle();
  await supabase.from("logs").insert({
    usuario_id: user.id,
    usuario_nome: prof?.nome ?? user.email,
    acao: opts.acao,
    entidade: opts.entidade,
    registro_id: opts.registro_id ?? null,
    detalhes: opts.detalhes ?? null
  });
}
const Sheet = Root;
const SheetTrigger = Trigger;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;
const Avatar = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$1,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = Root$1.displayName;
const AvatarImage = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = Image.displayName;
const AvatarFallback = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = Fallback.displayName;
const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/documentos", label: "Documentos", icon: FileText },
  { to: "/upload", label: "Upload", icon: Upload, adminOnly: true },
  { to: "/usuarios", label: "Usuários", icon: Settings, adminOnly: true }
];
function SidebarContent({ auth, onNavigate }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const filtered = navItems.filter((n) => !n.adminOnly || auth.role === "admin");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col bg-sidebar text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-16 items-center gap-2 px-6 border-b border-sidebar-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: logoSimm,
            alt: "Simm Docs",
            className: "h-6 w-6 object-contain brightness-0 invert"
          }
        ),
        " "
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold", children: "Simm Docs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-3 py-4 space-y-1", children: filtered.map((item) => {
      const active = pathname === item.to || pathname.startsWith(item.to + "/");
      const Icon = item.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: item.to,
          onClick: onNavigate,
          className: cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
            item.label
          ]
        },
        item.to
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-sidebar-border p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-2 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary text-xs font-semibold", children: (auth.nome ?? "U").slice(0, 2).toUpperCase() }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: auth.nome ?? "Usuário" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground capitalize", children: auth.role })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "w-full justify-start gap-2 mt-1",
          onClick: async () => {
            await supabase.auth.signOut();
            navigate({ to: "/login", replace: true });
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
            " Sair"
          ]
        }
      )
    ] })
  ] });
}
function AppShell({ children }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = reactExports.useState(false);
  if (auth.loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center text-muted-foreground text-sm", children: "Carregando…" });
  }
  if (!auth.user) {
    navigate({ to: "/login", replace: true });
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-surface", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { auth }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:pl-64", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2 font-display font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: logoSimm,
                alt: "DocFlow",
                className: "h-3.5 w-3.5 object-contain brightness-0 invert"
              }
            ),
            " "
          ] }),
          "DocFlow"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open, onOpenChange: setOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "icon", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "sr-only" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "left", className: "p-0 w-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { auth, onNavigate: () => setOpen(false) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "px-4 py-6 sm:px-8 sm:py-8 max-w-full", children })
    ] })
  ] });
}
function PageHeader({
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-semibold tracking-tight", children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: description })
    ] }),
    children && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children })
  ] });
}
export {
  AppShell as A,
  PageHeader as P,
  logAction as l,
  useAuth as u
};
