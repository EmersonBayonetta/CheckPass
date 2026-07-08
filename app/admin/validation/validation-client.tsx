"use client";

import { Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";

type Guest = {
  id: string;
  name: string;
  phone: string;
  status: string;
  companionsCount: number;
  maxCompanions: number;
  entryValidated: boolean;
  entryValidatedAt: string | null;
};

export function ValidationClient() {
  const [query, setQuery] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [suggestions, setSuggestions] = useState<Guest[]>([]);
  const [message, setMessage] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setLoadingSuggestions(true);
      const response = await fetch(`/api/admin/guests?q=${encodeURIComponent(trimmed)}`);
      const data = await response.json();
      setSuggestions((data.guests || []).slice(0, 6));
      setLoadingSuggestions(false);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query]);

  async function search(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(`/api/admin/guests?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    setGuests(data.guests || []);
    setSuggestions([]);
  }

  function selectSuggestion(guest: Guest) {
    setQuery(guest.name);
    setGuests([guest]);
    setSuggestions([]);
  }

  async function validate(id: string) {
    const response = await fetch("/api/admin/validate-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Nao foi possivel validar.");
      return;
    }
    setMessage("Entrada validada com sucesso.");
    setGuests((current) => current.map((guest) => (guest.id === id ? data.guest : guest)));
  }

  return (
    <section className="grid">
      <form className="card form" onSubmit={search}>
        <label className="field">
          <span>Nome ou telefone</span>
          <div className="suggestion-box">
            <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} autoFocus />
            {query.trim().length >= 2 ? (
              <div className="suggestions">
                {loadingSuggestions ? <div className="suggestion muted">Buscando...</div> : null}
                {!loadingSuggestions && suggestions.length === 0 ? <div className="suggestion muted">Nenhum convidado encontrado</div> : null}
                {suggestions.map((guest) => (
                  <button className="suggestion" key={guest.id} type="button" onClick={() => selectSuggestion(guest)}>
                    <strong>{guest.name}</strong>
                    <span>{guest.phone}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </label>
        <button className="button primary" type="submit">
          <Search size={18} /> Buscar
        </button>
      </form>

      {message ? <div className={message.includes("sucesso") ? "notice success" : "notice error"}>{message}</div> : null}

      <div className="result-list">
        {guests.map((guest) => (
          <article className="card" key={guest.id}>
            <h2>{guest.name}</h2>
            <p className="muted">{guest.phone}</p>
            <p>
              <StatusBadge status={guest.status} />{" "}
              <span className="muted">
                Acompanhantes: {guest.companionsCount}/{guest.maxCompanions}
              </span>
            </p>
            <p>{guest.entryValidated ? `Entrada ja validada em ${new Date(guest.entryValidatedAt || "").toLocaleString("pt-BR")}` : "Entrada pendente"}</p>
            <button className="button primary" disabled={guest.entryValidated} onClick={() => validate(guest.id)}>
              <ShieldCheck size={18} /> Validar entrada
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
