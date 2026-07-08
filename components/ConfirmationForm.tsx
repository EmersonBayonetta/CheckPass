"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

type Props = {
  guest: {
    token: string;
    name: string;
    maxCompanions: number;
    companionsCount: number;
    status: string;
  };
  editable: boolean;
};

export function ConfirmationForm({ guest, editable }: Props) {
  const [status, setStatus] = useState(guest.status);
  const [companionsCount, setCompanionsCount] = useState(guest.companionsCount);
  const [message, setMessage] = useState(editable ? "" : "Confirmações bloqueadas para este evento.");
  const [loading, setLoading] = useState(false);

  async function submit(nextStatus: "CONFIRMED" | "DECLINED") {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/public/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: guest.token,
        status: nextStatus,
        companionsCount: nextStatus === "CONFIRMED" ? companionsCount : 0
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error || "Não foi possível salvar sua resposta.");
      return;
    }
    setStatus(data.guest.status);
    setCompanionsCount(data.guest.companionsCount);
    setMessage(
      data.guest.status === "CONFIRMED"
        ? "Presenca confirmada. Obrigado!"
        : "Resposta registrada. Sentiremos sua falta."
    );
  }

  return (
    <div className="card">
      <p className="muted">Convite individual</p>
      <h1>Olá, {guest.name}</h1>
      <p>Você confirma presença?</p>
      <div className="form">
        {status !== "DECLINED" ? (
          <label className="field">
            <span>Acompanhantes</span>
            <input
              className="input"
              disabled={!editable || loading}
              max={guest.maxCompanions}
              min="0"
              type="number"
              value={companionsCount}
              onChange={(event) => setCompanionsCount(Number(event.target.value))}
            />
            <small className="muted">Limite permitido: {guest.maxCompanions}</small>
          </label>
        ) : null}
        {message ? (
          <div className={message.includes("bloqueadas") ? "notice error" : "notice success"}>{message}</div>
        ) : null}
        <div className="actions">
          <button className="button primary" disabled={!editable || loading} onClick={() => submit("CONFIRMED")}>
            <Check size={18} /> Sim
          </button>
          <button className="button danger" disabled={!editable || loading} onClick={() => submit("DECLINED")}>
            <X size={18} /> Não
          </button>
        </div>
      </div>
    </div>
  );
}
