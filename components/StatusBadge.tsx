export type ConfirmationStatus = "PENDING" | "CONFIRMED" | "DECLINED";

export function StatusBadge({ status }: { status: string }) {
  const map = {
    PENDING: ["pending", "Nao confirmado"],
    CONFIRMED: ["confirmed", "Confirmado"],
    DECLINED: ["declined", "Recusado"]
  } satisfies Record<ConfirmationStatus, [string, string]>;

  const [className, label] = map[status as ConfirmationStatus] ?? ["pending", "Nao confirmado"];
  return <span className={`badge ${className}`}>{label}</span>;
}
