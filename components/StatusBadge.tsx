export type ConfirmationStatus = "PENDING" | "CONFIRMED" | "DECLINED";

export function StatusBadge({ status }: { status: string }) {
  const map = {
    PENDING: ["pending", "Não confirmado"],
    CONFIRMED: ["confirmed", "Confirmado"],
    DECLINED: ["declined", "Recusado"]
  } satisfies Record<ConfirmationStatus, [string, string]>;

  const [className, label] = map[status as ConfirmationStatus] ?? ["pending", "Não confirmado"];
  return <span className={`badge ${className}`}>{label}</span>;
}
