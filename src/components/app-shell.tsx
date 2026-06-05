import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Upload,
  Search,
  FileText,
  Settings,
  LogOut,
  Menu,
  FileText as Logo,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AuthState } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logoSimm from "@/img/logo_simm.png";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/documentos", label: "Documentos", icon: FileText },
  { to: "/upload", label: "Upload", icon: Upload, adminOnly: true },
  { to: "/usuarios", label: "Usuários", icon: Settings, adminOnly: true },
];

function SidebarContent({ auth, onNavigate }: { auth: AuthState; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const filtered = navItems.filter((n) => !n.adminOnly || auth.role === "admin");

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
          <img
            src={logoSimm}
            alt="Simm Docs"
            className="h-6 w-6 object-contain brightness-0 invert"
          />{" "}
        </div>
        <span className="font-display text-lg font-semibold">Simm Docs</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {filtered.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {(auth.nome ?? "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{auth.nome ?? "Usuário"}</p>
            <p className="text-xs text-muted-foreground capitalize">{auth.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 mt-1"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/login", replace: true });
          }}
        >
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (auth.loading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground text-sm">
        Carregando…
      </div>
    );
  }

  if (!auth.user) {
    navigate({ to: "/login", replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-surface">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-sidebar-border">
        <SidebarContent auth={auth} />
      </aside>

      <div className="lg:pl-64">
        <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur px-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-display font-semibold">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <img
                src={logoSimm}
                alt="DocFlow"
                className="h-3.5 w-3.5 object-contain brightness-0 invert"
              />{" "}
              {/* Substitua o ícone aqui */}
            </div>
            DocFlow
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search className="sr-only" />
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent auth={auth} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="px-4 py-6 sm:px-8 sm:py-8 max-w-full">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
