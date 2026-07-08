import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { ValidationClient } from "./validation-client";

export default async function ValidationPage() {
  if (!(await requireAdmin())) redirect("/admin/login");

  return (
    <AdminShell>
      <div className="page-title">
        <div>
          <h1>Validação de entrada</h1>
          <p className="muted">Busque por nome ou telefone e registre a entrada rapidamente.</p>
        </div>
      </div>
      <ValidationClient />
    </AdminShell>
  );
}
