import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, FileText, CalendarDays, TrendingUp } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { formatDate, formatBytes } from "@/lib/format";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SimmDocs" }] }),
  component: DashboardPage,
});

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div
          className={`grid h-9 w-9 place-items-center rounded-md ${accent ?? "bg-primary/10 text-primary"}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</p>
    </Card>
  );
}

function DashboardPage() {
  const stats = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(1);
      since.setHours(0, 0, 0, 0);
      const [cli, doc, mes, recent] = await Promise.all([
        supabase.from("clientes").select("id", { count: "exact", head: true }),
        supabase.from("documentos").select("id", { count: "exact", head: true }),
        supabase
          .from("documentos")
          .select("id", { count: "exact", head: true })
          .gte("created_at", since.toISOString()),
        supabase
          .from("documentos")
          .select(
            "id, nome_original, tamanho, created_at, cliente:clientes(id, razao_social), categoria:categorias(nome)",
          )
          .order("created_at", { ascending: false })
          .limit(8),
      ]);
      return {
        clientes: cli.count ?? 0,
        documentos: doc.count ?? 0,
        mes: mes.count ?? 0,
        recent: recent.data ?? [],
      };
    },
  });

  return (
    <div>
      <PageHeader title="Dashboard - Simm Docs" description="Visão geral do sistema." />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Clientes" value={stats.data?.clientes ?? "—"} />
        <StatCard
          icon={FileText}
          label="Documentos"
          value={stats.data?.documentos ?? "—"}
          accent="bg-success/10 text-success"
        />
        <StatCard
          icon={CalendarDays}
          label="Enviados no mês"
          value={stats.data?.mes ?? "—"}
          accent="bg-warning/15 text-warning"
        />
        <StatCard
          icon={TrendingUp}
          label="Atividade"
          value={stats.data?.recent.length ?? "—"}
          accent="bg-accent text-accent-foreground"
        />
      </div>

      <Card className="mt-6 p-0 overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-display text-lg font-semibold">Últimos documentos</h2>
          <p className="text-sm text-muted-foreground">
            Os arquivos mais recentes adicionados ao sistema.
          </p>
        </div>
        <div className="divide-y divide-border">
          {(stats.data?.recent ?? []).length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Nenhum documento ainda.
            </div>
          )}
          {stats.data?.recent.map((d: any) => (
            <Link
              key={d.id}
              to="/clientes/$id"
              params={{ id: d.cliente?.id ?? "" }}
              className="flex items-center gap-4 p-4 hover:bg-accent/40 transition-colors"
            >
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{d.nome_original}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {d.cliente?.razao_social ?? "—"} · {d.categoria?.nome ?? "Sem categoria"}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground shrink-0">
                <p>{formatDate(d.created_at)}</p>
                <p>{formatBytes(d.tamanho)}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
