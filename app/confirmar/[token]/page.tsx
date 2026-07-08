import { notFound } from "next/navigation";
import { ConfirmationForm } from "@/components/ConfirmationForm";
import { confirmationIsEditable } from "@/lib/guest";
import { findGuestByToken } from "@/lib/db";

export default async function ConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const guest = await findGuestByToken(token);

  if (!guest) notFound();

  return (
    <main className="public-page">
      <section className="container narrow">
        <ConfirmationForm guest={guest} editable={confirmationIsEditable()} />
      </section>
    </main>
  );
}
