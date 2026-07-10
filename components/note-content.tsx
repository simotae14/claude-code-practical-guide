import type { JSONContent } from '@tiptap/react';

type Mark = { type: string; attrs?: Record<string, unknown> };

function applyMarks(text: string, marks: Mark[] = []): React.ReactNode {
  return marks.reduce<React.ReactNode>((children, mark, i) => {
    switch (mark.type) {
      case 'bold':
        return <strong key={i}>{children}</strong>;
      case 'italic':
        return <em key={i}>{children}</em>;
      case 'code':
        return <code key={i}>{children}</code>;
      case 'strike':
        return <s key={i}>{children}</s>;
      default:
        return children;
    }
  }, text);
}

function renderNode(node: JSONContent, key: number | string): React.ReactNode {
  const children = node.content?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case 'doc':
      return <>{children}</>;
    case 'paragraph':
      return <p key={key}>{children}</p>;
    case 'heading': {
      const level = (node.attrs?.level as number) ?? 1;
      if (level === 2) return <h2 key={key}>{children}</h2>;
      if (level === 3) return <h3 key={key}>{children}</h3>;
      return <h1 key={key}>{children}</h1>;
    }
    case 'bulletList':
      return <ul key={key}>{children}</ul>;
    case 'orderedList':
      return <ol key={key}>{children}</ol>;
    case 'listItem':
      return <li key={key}>{children}</li>;
    case 'blockquote':
      return <blockquote key={key}>{children}</blockquote>;
    case 'codeBlock':
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      );
    case 'horizontalRule':
      return <hr key={key} />;
    case 'hardBreak':
      return <br key={key} />;
    case 'text':
      return <span key={key}>{applyMarks(node.text ?? '', node.marks as Mark[] | undefined)}</span>;
    default:
      return children ? <span key={key}>{children}</span> : null;
  }
}

export function NoteContent({ content }: { content: JSONContent }) {
  if (!content?.content?.length) {
    return <p className='text-sm text-foreground/50'>Empty note.</p>;
  }

  return (
    <div className='prose-editor'>{content.content.map((node, i) => renderNode(node, i))}</div>
  );
}
