import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface NoteRow {
  id: string;
  user_id: string;
  share_id: string | null;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const existing = db.prepare('SELECT id, user_id, share_id FROM notes WHERE id = ?').get(id) as
    | NoteRow
    | undefined;

  if (!existing || existing.user_id !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const shareId = existing.share_id ?? crypto.randomUUID();

  db.prepare('UPDATE notes SET is_public = 1, share_id = ? WHERE id = ? AND user_id = ?').run(
    shareId,
    id,
    session.user.id,
  );

  return Response.json({ shareId });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const existing = db.prepare('SELECT id, user_id FROM notes WHERE id = ?').get(id) as
    | NoteRow
    | undefined;

  if (!existing || existing.user_id !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  db.prepare('UPDATE notes SET is_public = 0, share_id = NULL WHERE id = ? AND user_id = ?').run(
    id,
    session.user.id,
  );

  return Response.json({ success: true });
}
