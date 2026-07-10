import { Database } from 'bun:sqlite';

export const db = new Database('database.sqlite', { create: true });

db.run('PRAGMA journal_mode = WAL;');
db.run('PRAGMA foreign_keys = ON;');

db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    is_public   INTEGER NOT NULL DEFAULT 0,
    share_id    TEXT UNIQUE,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
  )
`);
