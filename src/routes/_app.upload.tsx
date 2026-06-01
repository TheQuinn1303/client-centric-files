import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload as UploadIcon } from "lucide-react";
import { UploadDocumentDialog } from "@/components/upload-document-dialog";

export const Route = createFileRoute("/_app/upload")({
  head: () => ({ meta: [{ title: "Upload — DocFlow" }] }),
  component: UploadPage,
});

function UploadPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!auth.loading && auth.role && auth.role !== "admin") {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [auth, navigate]);

  const clientes = useQuery({
    queryKey: ["clientes-min"],
    queryFn: async () => (await supabase.from("clientes").select("id, razao_social").order("razao_social")).data ?? [],
  });
  const categorias = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("id, nome").order("nome")).data ?? [],
  });

  return (
    <div>
      <PageHeader title="Enviar documento" description="Selecione um cliente e faça o upload do arquivo." />

      <Card className="p-10 text-center max-w-xl mx-auto">
        <div className="grid h-16 w-16 mx-auto place-items-center rounded-lg bg-primary/10 text-primary">
          <UploadIcon className="h-7 w-7" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Clique abaixo para abrir o assistente de upload.</p>
        <Button className="mt-5" onClick={() => setOpen(true)}>Abrir upload</Button>
      </Card>

      {(clientes.data && categorias.data) && (
        <UploadDocumentDialog
          open={open} onOpenChange={setOpen}
          clientes={clientes.data}
          categorias={categorias.data}
        />
      )}
    </div>
  );
}
