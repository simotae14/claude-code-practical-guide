'use client';

import { useState } from 'react';
import type { JSONContent } from '@tiptap/react';
import { TiptapEditor } from './tiptap-editor';

const INPUT_CLASS =
  'rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50';

interface EditNoteFormProps {
  id: string;
  initialTitle: string;
  initialContent: JSONContent;
  onSaved: (result: { title: string; content: JSONContent; updatedAt: string }) => void;
  onCancel: () => void;
}

export function EditNoteForm({
  id,
  initialTitle,
  initialContent,
  onSaved,
  onCancel,
}: EditNoteFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<JSONContent>(initialContent);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const data = await res.json();
        onSaved({ title: data.title, content: data.content, updatedAt: data.updated_at });
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? 'Failed to save note.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      <div className='flex flex-col gap-1'>
        <label htmlFor='title' className='text-sm font-medium text-foreground'>
          Title
        </label>
        <input
          id='title'
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isPending}
          placeholder='Note title'
          className={INPUT_CLASS}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <span className='text-sm font-medium text-foreground'>Content</span>
        <TiptapEditor onChange={setContent} initialContent={initialContent} />
      </div>

      {error && (
        <p role='alert' className='rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500'>
          {error}
        </p>
      )}

      <div className='flex items-center gap-3'>
        <button
          type='submit'
          disabled={isPending}
          className='flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isPending ? (
            <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent' />
          ) : (
            'Save changes'
          )}
        </button>
        <button
          type='button'
          onClick={onCancel}
          disabled={isPending}
          className='rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
