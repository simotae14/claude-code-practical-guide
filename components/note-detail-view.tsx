"use client";

import { useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { NoteContent } from "./note-content";
import { EditNoteForm } from "./edit-note-form";

interface NoteDetailViewProps {
  id: string;
  title: string;
  content: JSONContent;
  updatedAt: string;
}

export function NoteDetailView({ id, title, content, updatedAt }: NoteDetailViewProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentContent, setCurrentContent] = useState(content);
  const [currentUpdatedAt, setCurrentUpdatedAt] = useState(updatedAt);

  if (mode === "edit") {
    return (
      <EditNoteForm
        id={id}
        initialTitle={currentTitle}
        initialContent={currentContent}
        onCancel={() => setMode("view")}
        onSaved={(result) => {
          setCurrentTitle(result.title);
          setCurrentContent(result.content);
          setCurrentUpdatedAt(result.updatedAt);
          setMode("view");
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{currentTitle}</h1>
        <button
          type="button"
          onClick={() => setMode("edit")}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Edit
        </button>
      </div>

      <time className="mb-4 block text-xs text-foreground/40" dateTime={currentUpdatedAt}>
        Last updated {new Date(currentUpdatedAt).toLocaleDateString()}
      </time>

      <NoteContent content={currentContent} />
    </div>
  );
}
