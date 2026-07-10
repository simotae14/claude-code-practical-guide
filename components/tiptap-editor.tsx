'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { JSONContent } from '@tiptap/react';

interface TiptapEditorProps {
  onChange: (json: JSONContent) => void;
  initialContent?: JSONContent;
}

const BTN =
  'flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-foreground/10 disabled:opacity-40 aria-pressed:bg-foreground aria-pressed:text-background';

// ── SVG icons ────────────────────────────────────────────────────────────────

function IconBold() {
  return (
    <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M6 4h8a4 4 0 0 1 0 8H6V4zm0 8h9a4 4 0 0 1 0 8H6v-8z' />
    </svg>
  );
}

function IconItalic() {
  return (
    <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M11.49 3h5l-.32 2H14.3L11.7 19h1.87l-.32 2H7.49l.32-2H9.7l2.6-14H10.5l.99-2z' />
    </svg>
  );
}

function IconH1() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M3 4h2v7h4V4h2v16H9v-7H5v7H3V4zm12 12v-8.5l-2 1.5V7l2-1.5h2V16h-2z' />
    </svg>
  );
}

function IconH2() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M3 4h2v7h4V4h2v16H9v-7H5v7H3V4zm10 8.5a3 3 0 0 1 6 0c0 1-.6 1.9-1.4 2.7L15.5 18H19v2h-6v-1.5l3.5-3.5c.5-.5.8-1 .8-1.5a1 1 0 0 0-2 0h-2z' />
    </svg>
  );
}

function IconH3() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M3 4h2v7h4V4h2v16H9v-7H5v7H3V4zm10.5 4.5H17a1 1 0 1 1 0 2h-2v1h2a1 1 0 1 1 0 2h-3.5v2H17a3 3 0 0 0 0-6h-3.5V8.5z' />
    </svg>
  );
}

function IconParagraph() {
  return (
    <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d='M9 16h2v4h2V6h2v14h2V6h1V4H9a5 5 0 0 0 0 10z' />
    </svg>
  );
}

function IconCode() {
  return (
    <svg
      width='15'
      height='15'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden
    >
      <polyline points='16 18 22 12 16 6' />
      <polyline points='8 6 2 12 8 18' />
    </svg>
  );
}

function IconCodeBlock() {
  return (
    <svg
      width='15'
      height='15'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden
    >
      <rect x='2' y='3' width='20' height='18' rx='2' />
      <path d='M8 10l-3 2 3 2M16 10l3 2-3 2M12 8l-2 8' />
    </svg>
  );
}

function IconBulletList() {
  return (
    <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <circle cx='4' cy='7' r='1.5' />
      <circle cx='4' cy='12' r='1.5' />
      <circle cx='4' cy='17' r='1.5' />
      <rect x='8' y='6' width='12' height='2' rx='1' />
      <rect x='8' y='11' width='12' height='2' rx='1' />
      <rect x='8' y='16' width='12' height='2' rx='1' />
    </svg>
  );
}

function IconHorizontalRule() {
  return (
    <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <rect x='2' y='11' width='20' height='2' rx='1' />
    </svg>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────────

function Divider() {
  return <span className='mx-0.5 w-px self-stretch bg-foreground/15' aria-hidden />;
}

export function TiptapEditor({ onChange, initialContent }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  if (!editor) return null;

  return (
    <div className='flex flex-col rounded-lg border border-foreground/20 focus-within:border-foreground/50 focus-within:ring-2 focus-within:ring-foreground/20'>
      <div
        role='toolbar'
        aria-label='Text formatting'
        className='flex flex-wrap items-center gap-0.5 border-b border-foreground/10 p-1.5'
      >
        {/* Inline marks */}
        <button
          type='button'
          title='Bold'
          aria-label='Bold'
          aria-pressed={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={BTN}
        >
          <IconBold />
        </button>
        <button
          type='button'
          title='Italic'
          aria-label='Italic'
          aria-pressed={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={BTN}
        >
          <IconItalic />
        </button>
        <button
          type='button'
          title='Inline code'
          aria-label='Inline code'
          aria-pressed={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={BTN}
        >
          <IconCode />
        </button>

        <Divider />

        {/* Block type */}
        <button
          type='button'
          title='Normal text'
          aria-label='Normal text'
          aria-pressed={!editor.isActive('heading')}
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={BTN}
        >
          <IconParagraph />
        </button>
        <button
          type='button'
          title='Heading 1'
          aria-label='Heading 1'
          aria-pressed={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={BTN}
        >
          <IconH1 />
        </button>
        <button
          type='button'
          title='Heading 2'
          aria-label='Heading 2'
          aria-pressed={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={BTN}
        >
          <IconH2 />
        </button>
        <button
          type='button'
          title='Heading 3'
          aria-label='Heading 3'
          aria-pressed={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={BTN}
        >
          <IconH3 />
        </button>

        <Divider />

        {/* Lists & blocks */}
        <button
          type='button'
          title='Bullet list'
          aria-label='Bullet list'
          aria-pressed={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={BTN}
        >
          <IconBulletList />
        </button>
        <button
          type='button'
          title='Code block'
          aria-label='Code block'
          aria-pressed={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={BTN}
        >
          <IconCodeBlock />
        </button>
        <button
          type='button'
          title='Horizontal rule'
          aria-label='Horizontal rule'
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={BTN}
        >
          <IconHorizontalRule />
        </button>
      </div>

      <EditorContent
        editor={editor}
        className='prose-editor min-h-48 px-3 py-2 text-sm text-foreground focus:outline-none'
      />
    </div>
  );
}
