"use client";

import { AlertCircle, Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton({ link }: { link: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = link;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  }

  return (
    <button className="button secondary" type="button" onClick={copyLink}>
      {status === "copied" ? <Check size={18} /> : status === "error" ? <AlertCircle size={18} /> : <Copy size={18} />}
      {status === "copied" ? "Copiado" : status === "error" ? "Erro ao copiar" : "Copiar"}
    </button>
  );
}
