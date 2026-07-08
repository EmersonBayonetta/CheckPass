import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime, publicUrlForToken } from "@/lib/format";
import { requireAdmin } from "@/lib/auth";
import { eventTotals, listGuests } from "@/lib/db";

type SearchParams = Promise<{ status?: string }>;

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  if (!(await requireAdmin())) redirect("/admin/login");

  const { status } = await searchParams;
  const [guests, totals] = await Promise.all([
    listGuests(
      status === "CONFIRMED" || status === "PENDING" || status === "DECLINED"
        ? { status }
        : status === "VALIDATED"
          ? { validated: true }
          : undefined
    ),
    eventTotals()
  ]);
  const confirmedCount = totals.confirmedGuests;
  const companionsCount = totals.confirmedCompanions;

  return (
    <AdminShell>
      <div className="page-title">
        <div>
          <h1>Painel administrativo</h1>
          <p className="muted">Acompanhe confirmacoes, links e entrada do evento.</p>
        </div>
        <Link className="button primary" href="/admin/guests">
          Cadastrar convidado
        </Link>
      </div>

      <section className="grid stats">
        <div className="stat">
          <span className="muted">Convidados confirmados</span>
          <strong>{confirmedCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">Acompanhantes</span>
          <strong>{companionsCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">Total previsto</span>
          <strong>{confirmedCount + companionsCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">Ja validados</span>
          <strong>{totals.validatedGuests}</strong>
        </div>
      </section>

      <div className="actions" style={{ margin: "22px 0" }}>
        <Link className="button secondary" href="/admin">
          Todos
        </Link>
        <Link className="button secondary" href="/admin?status=CONFIRMED">
          Confirmados
        </Link>
        <Link className="button secondary" href="/admin?status=PENDING">
          Nao confirmados
        </Link>
        <Link className="button secondary" href="/admin?status=DECLINED">
          Recusados
        </Link>
        <Link className="button secondary" href="/admin?status=VALIDATED">
          Ja validados
        </Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Convidado</th>
              <th>Status</th>
              <th>Acompanhantes</th>
              <th>Confirmacao</th>
              <th>Entrada</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id}>
                <td>
                  <strong>{guest.name}</strong>
                  <br />
                  <span className="muted">{guest.phone}</span>
                </td>
                <td>
                  <StatusBadge status={guest.status} />
                </td>
                <td>
                  {guest.companionsCount}/{guest.maxCompanions}
                </td>
                <td>{formatDateTime(guest.confirmedAt)}</td>
                <td>{guest.entryValidated ? formatDateTime(guest.entryValidatedAt) : "Pendente"}</td>
                <td>
                  <div className="actions">
                    <a className="button ghost" href={publicUrlForToken(guest.token)} target="_blank">
                      Abrir
                    </a>
                    <CopyLinkButton link={publicUrlForToken(guest.token)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
