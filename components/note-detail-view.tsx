"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { JSONContent } from "@tiptap/react";
import { NoteContent } from "./note-content";

interface NoteDetailViewProps {
  id: string;
  title: string;
  content: JSONContent;
  updatedAt: string;
}

export function NoteDetailView({ id, title, content, updatedAt }: NoteDetailViewProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });

      if (res.ok) {
        router.push("/notes");
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Failed to delete note.");
        setIsDeleting(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <div className="flex items-center gap-3">
          <Link
            href={`/notes/${id}/edit`}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      </div>

      <time className="mb-4 block text-xs text-foreground/40" dateTime={updatedAt}>
        Last updated {new Date(updatedAt).toLocaleDateString()}
      </time>

      <NoteContent content={content} />

      <dialog
        ref={dialogRef}
        onClose={() => setError(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="fixed top-1/2 left-1/2 m-0 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-foreground/10 bg-background p-6 text-foreground backdrop:bg-black/40"
        aria-labelledby="delete-note-title"
      >
        <div className="flex flex-col gap-4">
          <h2 id="delete-note-title" className="text-lg font-semibold text-foreground">
            Delete note?
          </h2>
          <p className="text-sm text-foreground/70">
            This action cannot be undone. This will permanently delete &ldquo;{title}&rdquo;.
          </p>

          {error && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              disabled={isDeleting}
              className="rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
