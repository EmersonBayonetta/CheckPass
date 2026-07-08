"use client";

import Link from "next/link";
import { CheckCircle, Save, X } from "lucide-react";
import { useState } from "react";

type GuestFormProps = {
  onCreated?: () => void;
};

export function GuestForm({ onCreated }: GuestFormProps) {
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/guests", {
      method: "POST",
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
      setMessage(data.error || "Nao foi possivel cadastrar.");
      return;
    }
    event.currentTarget.reset();
    setMessage("");
    setShowSuccess(true);
    onCreated?.();
  }

  return (
    <>
      <form className="form card" onSubmit={handleSubmit}>
        <h2>Novo convidado</h2>
        <div className="row">
          <label className="field">
            <span>Nome</span>
            <input className="input" name="name" required />
          </label>
          <label className="field">
            <span>Telefone</span>
            <input className="input" name="phone" required />
          </label>
        </div>
        <div className="row">
          <label className="field">
            <span>E-mail opcional</span>
            <input className="input" name="email" type="email" />
          </label>
          <label className="field">
            <span>Maximo de acompanhantes</span>
            <input className="input" min="0" name="maxCompanions" type="number" defaultValue="0" />
          </label>
        </div>
        {message && !showSuccess ? <div className="notice error">{message}</div> : null}
        <button className="button primary" disabled={loading} type="submit">
          <Save size={18} /> {loading ? "Salvando..." : "Cadastrar"}
        </button>
      </form>

      {showSuccess ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <button className="icon-button" type="button" aria-label="Fechar" onClick={() => setShowSuccess(false)}>
              <X size={18} />
            </button>
            <CheckCircle className="success-icon" size={42} />
            <h2>Convidado cadastrado</h2>
            <p className="muted">O link individual foi gerado e ja esta disponivel no painel.</p>
            <div className="actions center">
              <button className="button secondary" type="button" onClick={() => setShowSuccess(false)}>
                Cadastrar outro
              </button>
              <Link className="button primary" href="/admin">
                Voltar ao painel
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
