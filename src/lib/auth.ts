import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AppRole = "admin" | "usuario";

export interface AuthState {
  loading: boolean;
  user: User | null;
  role: AppRole | null;
  nome: string | null;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    user: null,
    role: null,
    nome: null,
  });

  useEffect(() => {
    let mounted = true;

    const load = async (user: User | null) => {
      if (!user) {
        if (mounted) setState({ loading: false, user: null, role: null, nome: null });
        return;
      }
      // fetch role + profile in parallel
      const [roleRes, profRes] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
        supabase.from("profiles").select("nome").eq("id", user.id).maybeSingle(),
      ]);
      if (!mounted) return;
      setState({
        loading: false,
        user,
        role: (roleRes.data?.role as AppRole) ?? "usuario",
        nome: profRes.data?.nome ?? user.email ?? null,
      });
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      load(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => load(data.session?.user ?? null));

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}

export async function logAction(opts: {
  acao: string;
  entidade: string;
  registro_id?: string | null;
  detalhes?: Record<string, unknown>;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: prof } = await supabase.from("profiles").select("nome").eq("id", user.id).maybeSingle();
  await supabase.from("logs").insert({
    usuario_id: user.id,
    usuario_nome: prof?.nome ?? user.email,
    acao: opts.acao,
    entidade: opts.entidade,
    registro_id: opts.registro_id ?? null,
    detalhes: (opts.detalhes ?? null) as never,
  });
}
