import Link from "next/link";
import { LogOut } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <header className="topbar">
        <Link className="brand" href="/admin">
          CheckPass
        </Link>
        <nav className="nav">
          <Link className="button ghost" href="/admin">
            Painel
          </Link>
          <Link className="button ghost" href="/admin/guests">
            Convidados
          </Link>
          <Link className="button ghost" href="/admin/validation">
            Entrada
          </Link>
          <form action="/api/auth/logout" method="post">
            <button className="button secondary" type="submit">
              <LogOut size={18} /> Sair
            </button>
          </form>
        </nav>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
