import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, useMemo } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query"; // Import useQuery

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import logoSimm from "@/img/logo_simm.png";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — SimmDocs" }] }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("E-mail inválido").max(255),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72),
  nome: z.string().trim().min(2).max(100).optional(),
});

type AppSettings = {
  logo_url: string | null;
};

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      email,
      password,
      nome: mode === "signup" ? nome : undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nome },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Faça login.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha na autenticação");
    } finally {
      setLoading(false);
    }
  };

  // Fetch global app settings for logo
  const appSettings = useQuery({
    queryKey: ["appSettings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("app_settings").select("logo_url").single();
      // PGRST116 é o código de erro para "nenhuma linha encontrada", o que é aceitável se o logo for opcional
      if (error && error.code !== "PGRST116") throw error;
      return data as AppSettings | null;
    },
    staleTime: Infinity, // As configurações da aplicação não mudam com frequência
  });

  const logoUrl = useMemo(() => appSettings.data?.logo_url, [appSettings.data]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-[#02347c] via-[#054a91] to-[#b6dbf4]">
      <div className="hidden lg:flex flex-col justify-between p-12 text-white">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-semibold text-white"
        >
          {logoUrl ? ( // Se houver uma URL de logo, use a imagem
            <img src={logoUrl} alt="Logo DocFlow" className="h-9 w-auto object-contain" />
          ) : (
            // Caso contrário, use a imagem local do Plano A
            <img
              src={logoSimm}
              alt="Simm Computadores"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          )}
          Simm Computadores Documentação
        </Link>
        <div className="max-w-md space-y-4">
          <h1 className="font-display text-5xl font-bold tracking-tight leading-tight">
            Centralização de documentos SIMM Computadores.
          </h1>
          <p className="text-white/80">
            Substuisão das pasta da documentação do servidor pra um sistema moderno de
            armazenamento, busca e auditoria — tudo em um só lugar.
          </p>
        </div>
        <p className="text-xs text-white/60"> © {new Date().getFullYear()} Simm Computadores</p>
      </div>

      <div className="flex items-center justify-center p-6 bg-white/5 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-0">
        <Card className="w-full max-w-md p-8 space-y-6 bg-white/95 shadow-2xl border-none">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              {mode === "login" ? "Entrar" : "Criar conta"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login"
                ? "Acesse sua conta para gerenciar documentos."
                : "O primeiro usuário cadastrado se torna administrador."}
            </p>
          </div>

          <form onSubmit={handle} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Não tem conta?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-primary font-medium hover:underline"
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary font-medium hover:underline"
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
