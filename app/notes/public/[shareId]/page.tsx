import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { NoteContent } from '@/components/note-content';

interface PublicNoteRow {
  title: string;
  content: string;
}

export default async function PublicNotePage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const row = db
    .prepare('SELECT title, content FROM notes WHERE share_id = ? AND is_public = 1')
    .get(shareId) as PublicNoteRow | undefined;

  if (!row) notFound();

  return (
    <div>
      <h1 className='mb-6 text-2xl font-semibold text-foreground'>{row.title}</h1>
      <NoteContent content={JSON.parse(row.content)} />
    </div>
  );
}
