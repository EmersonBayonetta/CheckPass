"use client";

import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button className="menu-button" type="button" aria-label="Abrir menu" onClick={() => setOpen(true)}>
        <Menu size={22} />
      </button>

      {open ? (
        <div className="mobile-menu-backdrop">
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <strong>Menu</strong>
              <button className="icon-button" type="button" aria-label="Fechar menu" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <Link className="button ghost" href="/admin" onClick={() => setOpen(false)}>
              Painel
            </Link>
            <Link className="button ghost" href="/admin/guests" onClick={() => setOpen(false)}>
              Convidados
            </Link>
            <Link className="button ghost" href="/admin/validation" onClick={() => setOpen(false)}>
              Entrada
            </Link>
            <form action="/api/auth/logout" method="post">
              <button className="button secondary" type="submit">
                <LogOut size={18} /> Sair
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
