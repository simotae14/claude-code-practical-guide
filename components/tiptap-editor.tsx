'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { JSONContent } from '@tiptap/react';
import {
  Bold as IconBold,
  Italic as IconItalic,
  Heading1 as IconH1,
  Heading2 as IconH2,
  Heading3 as IconH3,
  Pilcrow as IconParagraph,
  Code as IconCode,
  SquareCode as IconCodeBlock,
  List as IconBulletList,
  Minus as IconHorizontalRule,
} from 'lucide-react';

interface TiptapEditorProps {
  onChange: (json: JSONContent) => void;
  initialContent?: JSONContent;
}

const BTN =
  'flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-foreground/10 disabled:opacity-40 aria-pressed:bg-foreground aria-pressed:text-background';

const ICON = 'size-[15px]';

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
          <IconBold className={ICON} aria-hidden />
        </button>
        <button
          type='button'
          title='Italic'
          aria-label='Italic'
          aria-pressed={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={BTN}
        >
          <IconItalic className={ICON} aria-hidden />
        </button>
        <button
          type='button'
          title='Inline code'
          aria-label='Inline code'
          aria-pressed={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={BTN}
        >
          <IconCode className={ICON} aria-hidden />
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
          <IconParagraph className={ICON} aria-hidden />
        </button>
        <button
          type='button'
          title='Heading 1'
          aria-label='Heading 1'
          aria-pressed={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={BTN}
        >
          <IconH1 className={ICON} aria-hidden />
        </button>
        <button
          type='button'
          title='Heading 2'
          aria-label='Heading 2'
          aria-pressed={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={BTN}
        >
          <IconH2 className={ICON} aria-hidden />
        </button>
        <button
          type='button'
          title='Heading 3'
          aria-label='Heading 3'
          aria-pressed={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={BTN}
        >
          <IconH3 className={ICON} aria-hidden />
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
          <IconBulletList className={ICON} aria-hidden />
        </button>
        <button
          type='button'
          title='Code block'
          aria-label='Code block'
          aria-pressed={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={BTN}
        >
          <IconCodeBlock className={ICON} aria-hidden />
        </button>
        <button
          type='button'
          title='Horizontal rule'
          aria-label='Horizontal rule'
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={BTN}
        >
          <IconHorizontalRule className={ICON} aria-hidden />
        </button>
      </div>

      <EditorContent
        editor={editor}
        className='prose-editor min-h-48 px-3 py-2 text-sm text-foreground focus:outline-none'
      />
    </div>
  );
}
