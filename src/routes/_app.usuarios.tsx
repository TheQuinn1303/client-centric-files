import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { ShieldCheck, User as UserIcon } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_app/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — DocFlow" }] }),
  component: UsuariosPage,
});

function UsuariosPage() {
  const auth = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!auth.loading && auth.role && auth.role !== "admin") {
      nav({ to: "/dashboard", replace: true });
    }
  }, [auth, nav]);

  const users = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const map = new Map((roles ?? []).map((r) => [r.user_id, r.role]));
      return (profiles ?? []).map((p) => ({ ...p, role: map.get(p.id) ?? "usuario" }));
    },
  });

  const toggleRole = async (userId: string, current: string) => {
    const next = current === "admin" ? "usuario" : "admin";
    const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (delErr) {
      toast.error(delErr.message);
      return;
    }
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: next as "admin" | "usuario" });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Usuário agora é ${next}`);
    qc.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <div>
      <PageHeader title="Usuários" description="Gerencie os perfis de acesso." />

      <Card className="overflow-hidden">
        <div className="divide-y divide-border">
          {users.data?.map((u: any) => (
            <div key={u.id} className="flex items-center gap-4 p-4">
              <div
                className={`grid h-10 w-10 place-items-center rounded-full ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
              >
                {u.role === "admin" ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <UserIcon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{u.nome}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <Badge variant={u.role === "admin" ? "default" : "secondary"} className="capitalize">
                {u.role}
              </Badge>
              <div className="text-xs text-muted-foreground hidden sm:block">
                {formatDate(u.created_at)}
              </div>
              {u.id !== auth.user?.id && (
                <Button variant="outline" size="sm" onClick={() => toggleRole(u.id, u.role)}>
                  Tornar {u.role === "admin" ? "usuário" : "admin"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
