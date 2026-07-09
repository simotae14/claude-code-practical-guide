import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { NoteDetailView } from "@/components/note-detail-view";

interface NoteRow {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  const { id } = await params;
  const row = db
    .prepare("SELECT id, title, content, updated_at FROM notes WHERE id = ? AND user_id = ?")
    .get(id, session.user.id) as NoteRow | undefined;

  if (!row) notFound();

  return (
    <NoteDetailView
      id={row.id}
      title={row.title}
      content={JSON.parse(row.content)}
      updatedAt={row.updated_at}
    />
  );
}
