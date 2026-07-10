import { db } from '@/lib/db';

interface PublicNoteRow {
  title: string;
  content: string;
}

export async function GET(request: Request, { params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const row = db
    .prepare('SELECT title, content FROM notes WHERE share_id = ? AND is_public = 1')
    .get(shareId) as PublicNoteRow | undefined;

  if (!row) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json({ title: row.title, content: JSON.parse(row.content) });
}
