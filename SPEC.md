# Note Taking App — Technical Specification

## 1. Project Overview

A web application that enables authenticated users to create and manage personal notes using a rich text editor. Notes can optionally be shared publicly via a unique URL.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Runtime | Bun |
| Language | TypeScript |
| Styling | TailwindCSS |
| Authentication | better-auth |
| Rich Text Editor | TipTap |
| Database | SQLite via Bun's built-in SQLite client |
| Queries | Raw SQL statements |

---

## 3. Authentication

- Implemented using the **better-auth** library
- All note-related operations (create, read, update, delete, share) require an authenticated session
- Unauthenticated users can only access publicly shared notes via their public URL
- Session management handled by better-auth (cookies-based)

---

## 4. Features

### 4.1 Note Management

Authenticated users can:

- **Create** a new note using the rich text editor
- **View** a list of all their notes
- **View** a single note in detail
- **Update** an existing note (title and/or content)
- **Delete** a note permanently

### 4.2 Note Sharing

- A user can **share a note publicly**, generating a unique public URL for that note
- A user can **stop sharing** a note, revoking public access
- Publicly shared notes are **read-only** for unauthenticated visitors
- The public URL format: `/notes/public/[shareId]`

### 4.3 Rich Text Formatting

The TipTap editor must support the following formatting options:

| Feature | Description |
|---|---|
| Bold | Inline bold text |
| Italic | Inline italic text |
| Heading 1 | Large section heading |
| Heading 2 | Medium section heading |
| Heading 3 | Small section heading |
| Normal text | Default paragraph style |
| Inline code | Short inline `code` spans |
| Code block | Multi-line code snippet block |
| Bullet list | Unordered bullet point list |
| Horizontal rule | Visual separator line |

---

## 5. Data Model

### 5.1 Notes Table

```sql
CREATE TABLE notes (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,              -- TipTap JSON stored as serialized JSON string
  is_public   INTEGER NOT NULL DEFAULT 0, -- 0 = private, 1 = public
  share_id    TEXT UNIQUE,                -- unique token for public URL, null if not shared
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);
```

### 5.2 Auth Tables (managed by better-auth)

The following tables are created and managed automatically by **better-auth**. Do not create them manually — use the better-auth CLI (`npx auth@latest migrate`) or generate the schema with `npx auth@latest generate`.

#### `user`

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT | Primary key |
| `name` | TEXT | Display name |
| `email` | TEXT | Unique |
| `emailVerified` | BOOLEAN | |
| `image` | TEXT | Optional, profile image URL |
| `createdAt` | DATE | |
| `updatedAt` | DATE | |

#### `session`

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT | Primary key |
| `userId` | TEXT | Foreign key → `user.id` (cascade delete) |
| `token` | TEXT | Unique session token |
| `expiresAt` | DATE | |
| `ipAddress` | TEXT | Optional |
| `userAgent` | TEXT | Optional |
| `createdAt` | DATE | |
| `updatedAt` | DATE | |

#### `account`

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT | Primary key |
| `userId` | TEXT | Foreign key → `user.id` (cascade delete) |
| `accountId` | TEXT | Provider account ID, or `userId` for credential accounts |
| `providerId` | TEXT | e.g. `"credential"` for email/password |
| `accessToken` | TEXT | Optional |
| `refreshToken` | TEXT | Optional |
| `accessTokenExpiresAt` | DATE | Optional |
| `refreshTokenExpiresAt` | DATE | Optional |
| `scope` | TEXT | Optional |
| `idToken` | TEXT | Optional |
| `password` | TEXT | Optional, hashed — used for email/password auth |
| `createdAt` | DATE | |
| `updatedAt` | DATE | |

#### `verification`

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT | Primary key |
| `identifier` | TEXT | The verification target (e.g. email) |
| `value` | TEXT | The value to verify |
| `expiresAt` | DATE | |
| `createdAt` | DATE | |
| `updatedAt` | DATE | |

---

## 6. Pages & Routing

| Route | Auth Required | Description |
|---|---|---|
| `/` | No | Landing / home page |
| `/sign-in` | No | Sign in form |
| `/sign-up` | No | Registration form |
| `/notes` | Yes | List of all user's notes |
| `/notes/new` | Yes | Create a new note |
| `/notes/[id]` | Yes | View and edit a specific note |
| `/notes/public/[shareId]` | No | Read-only view of a shared note |

---

## 7. API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/notes` | Yes | Fetch all notes for the authenticated user |
| POST | `/api/notes` | Yes | Create a new note |
| GET | `/api/notes/[id]` | Yes | Fetch a single note by ID |
| PUT | `/api/notes/[id]` | Yes | Update a note's title and/or content |
| DELETE | `/api/notes/[id]` | Yes | Delete a note |
| POST | `/api/notes/[id]/share` | Yes | Enable public sharing, generate `share_id` |
| DELETE | `/api/notes/[id]/share` | Yes | Disable public sharing, clear `share_id` |
| GET | `/api/notes/public/[shareId]` | No | Fetch a publicly shared note |

---

## 8. UI / UX Requirements

- Responsive layout using TailwindCSS
- Notes list shows: note title, creation date, and a sharing status indicator
- The TipTap editor toolbar must include buttons/icons for all supported formatting options (bold, italic, headings, code, bullet list, horizontal rule)
- A "Share" button on the note detail page toggles public sharing on/off and displays the public URL when sharing is active
- Confirmation prompt before deleting a note
- Loading and error states on all async operations

---

## 9. Security Requirements

- Only the owner of a note can view, edit, delete, or change its sharing status
- Public notes expose only title and content — no user data
- `share_id` must be a cryptographically random unique token (e.g. UUID v4 or similar)
- All API routes enforce authentication server-side (not just client-side redirects)

---

## 10. Out of Scope

The following features are explicitly **not** included in this version:

- Real-time collaboration
- Note tagging or categories
- Search functionality
- Email notifications
- Image or file attachments
- OAuth / social login
