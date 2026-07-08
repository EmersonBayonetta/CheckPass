"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="button secondary" type="button" onClick={copyLink}>
      {copied ? <Check size={18} /> : <Copy size={18} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
