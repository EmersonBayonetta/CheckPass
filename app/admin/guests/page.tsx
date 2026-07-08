import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { GuestForm } from "@/components/GuestForm";
import { requireAdmin } from "@/lib/auth";

export default async function GuestsPage() {
  if (!(await requireAdmin())) redirect("/admin/login");

  return (
    <AdminShell>
      <div className="page-title">
        <div>
          <h1>Cadastro de convidados</h1>
          <p className="muted">Cadastre manualmente e gere links individuais automaticamente.</p>
        </div>
      </div>
      <GuestForm />
    </AdminShell>
  );
}
