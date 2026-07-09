import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NewNoteForm } from "@/components/new-note-form";

export default async function NewNotePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">New Note</h1>
      <NewNoteForm />
    </div>
  );
}
