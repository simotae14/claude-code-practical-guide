"use client";

import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { EditNoteForm } from "./edit-note-form";

interface EditNotePageProps {
  id: string;
  title: string;
  content: JSONContent;
}

export function EditNotePage({ id, title, content }: EditNotePageProps) {
  const router = useRouter();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Edit note</h1>
      <EditNoteForm
        id={id}
        initialTitle={title}
        initialContent={content}
        onSaved={() => router.push(`/notes/${id}`)}
        onCancel={() => router.push(`/notes/${id}`)}
      />
    </div>
  );
}
