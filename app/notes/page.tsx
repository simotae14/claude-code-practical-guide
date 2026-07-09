import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface NoteRow {
  id: string;
  title: string;
  is_public: number;
  created_at: string;
}

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  const notes = db
    .prepare("SELECT id, title, is_public, created_at FROM notes WHERE user_id = ? ORDER BY created_at DESC")
    .all(session.user.id) as NoteRow[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">My Notes</h1>
        <Link
          href="/notes/new"
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-foreground/50">No notes yet. Create your first one!</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                href={`/notes/${note.id}`}
                className="flex items-center justify-between rounded-lg border border-foreground/10 px-4 py-3 transition-colors hover:border-foreground/30 hover:bg-foreground/5"
              >
                <span className="font-medium text-foreground">{note.title}</span>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {note.is_public === 1 && (
                    <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground/60">
                      Shared
                    </span>
                  )}
                  <time className="text-xs text-foreground/40" dateTime={note.created_at}>
                    {new Date(note.created_at).toLocaleDateString()}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
