"use client";

import { Pencil, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type GuestActionsProps = {
  guest: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    maxCompanions: number;
  };
};

export function GuestActions({ guest }: GuestActionsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function updateGuest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/admin/guests/${guest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        maxCompanions: Number(form.get("maxCompanions") || 0)
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error || "Nao foi possivel editar o convidado.");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  async function deleteGuest() {
    setLoading(true);
    setMessage("");
    const response = await fetch(`/api/admin/guests/${guest.id}`, { method: "DELETE" });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error || "Nao foi possivel apagar o convidado.");
      return;
    }

    setDeleting(false);
    router.refresh();
  }

  return (
    <>
      <div className="actions">
        <button className="button ghost" type="button" onClick={() => setEditing(true)}>
          <Pencil size={18} /> Editar
        </button>
        <button className="button danger" type="button" onClick={() => setDeleting(true)}>
          <Trash2 size={18} /> Apagar
        </button>
      </div>

      {editing ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <form className="modal form" onSubmit={updateGuest}>
            <button className="icon-button" type="button" aria-label="Fechar" onClick={() => setEditing(false)}>
              <X size={18} />
            </button>
            <h2>Editar convidado</h2>
            <label className="field">
              <span>Nome</span>
              <input className="input" name="name" defaultValue={guest.name} required />
            </label>
            <label className="field">
              <span>Telefone</span>
              <input className="input" name="phone" defaultValue={guest.phone} required />
            </label>
            <label className="field">
              <span>E-mail opcional</span>
              <input className="input" name="email" type="email" defaultValue={guest.email || ""} />
            </label>
            <label className="field">
              <span>Maximo de acompanhantes</span>
              <input className="input" name="maxCompanions" type="number" min="0" defaultValue={guest.maxCompanions} />
            </label>
            {message ? <div className="notice error">{message}</div> : null}
            <button className="button primary" disabled={loading} type="submit">
              {loading ? "Salvando..." : "Salvar alteracoes"}
            </button>
          </form>
        </div>
      ) : null}

      {deleting ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <button className="icon-button" type="button" aria-label="Fechar" onClick={() => setDeleting(false)}>
              <X size={18} />
            </button>
            <h2>Apagar convidado</h2>
            <p className="muted">Tem certeza que deseja apagar {guest.name}? Essa acao nao pode ser desfeita.</p>
            {message ? <div className="notice error">{message}</div> : null}
            <div className="actions center">
              <button className="button ghost" type="button" onClick={() => setDeleting(false)}>
                Cancelar
              </button>
              <button className="button danger" disabled={loading} type="button" onClick={deleteGuest}>
                {loading ? "Apagando..." : "Apagar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
