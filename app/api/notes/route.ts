import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const createNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { title, content } = parsed.data;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    "INSERT INTO notes (id, user_id, title, content, is_public, share_id, created_at, updated_at) VALUES (?, ?, ?, ?, 0, NULL, ?, ?)"
  ).run(id, session.user.id, title, JSON.stringify(content), now, now);

  return Response.json({ id }, { status: 201 });
}
