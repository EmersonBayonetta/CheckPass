"use client";

import Link from "next/link";
import { CheckCircle, Save, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { CopyLinkButton } from "@/components/CopyLinkButton";

type GuestFormProps = {
  onCreated?: () => void;
};

type CreatedGuest = {
  name: string;
  link: string;
};

export function GuestForm({ onCreated }: GuestFormProps) {
  const [message, setMessage] = useState("");
  const [createdGuest, setCreatedGuest] = useState<CreatedGuest | null>(null);
  const [loading, setLoading] = useState(false);

  async function readResponse(response: Response) {
    const text = await response.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setLoading(true);
    setMessage("");
    setCreatedGuest(null);
    try {
      const form = new FormData(formElement);
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
      const data = await readResponse(response);

      if (!response.ok || !data.guest) {
        setMessage(data.error || "Não foi possível cadastrar. Tente novamente.");
        return;
      }

      formElement.reset();
      setMessage("");
      setCreatedGuest({
        name: data.guest.name,
        link: data.guest.link
      });
      onCreated?.();
    } catch {
      setMessage("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
            <span>Máximo de acompanhantes</span>
            <input className="input" min="0" name="maxCompanions" type="number" defaultValue="0" />
          </label>
        </div>
        {message && !createdGuest ? <div className="notice error">{message}</div> : null}
        <button className="button primary" disabled={loading} type="submit">
          <Save size={18} /> {loading ? "Salvando..." : "Cadastrar"}
        </button>
      </form>

      {createdGuest ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <button className="icon-button" type="button" aria-label="Fechar" onClick={() => setCreatedGuest(null)}>
              <X size={18} />
            </button>
            <div className="success-burst">
              <Sparkles size={18} />
              <CheckCircle size={44} />
            </div>
            <h2>Convidado cadastrado</h2>
            <p className="muted">
              {createdGuest.name} foi cadastrado com sucesso. O link individual já está pronto para envio.
            </p>
            <div className="success-link">{createdGuest.link}</div>
            <div className="actions center">
              <CopyLinkButton link={createdGuest.link} />
              <button className="button secondary" type="button" onClick={() => setCreatedGuest(null)}>
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
