import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const updateNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.record(z.string(), z.unknown()),
});

interface NoteRow {
  id: string;
  user_id: string;
  title: string;
  content: string;
  updated_at: string;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const row = db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as NoteRow | undefined;

  if (!row || row.user_id !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json({
    id: row.id,
    title: row.title,
    content: JSON.parse(row.content),
    updated_at: row.updated_at,
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const existing = db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as NoteRow | undefined;

  if (!existing || existing.user_id !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { title, content } = parsed.data;
  const now = new Date().toISOString();

  db.prepare(
    'UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ? AND user_id = ?',
  ).run(title, JSON.stringify(content), now, id, session.user.id);

  return Response.json({ id, title, content, updated_at: now });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const existing = db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as NoteRow | undefined;

  if (!existing || existing.user_id !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?').run(id, session.user.id);

  return Response.json({ success: true });
}
