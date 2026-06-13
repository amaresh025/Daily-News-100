import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Bold, Italic, Strikethrough, Heading2, Heading3, List, ListOrdered,
  Quote, Undo2, Redo2, Link as LinkIcon, Image as ImageIcon, Code,
} from 'lucide-react';

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX = 5 * 1024 * 1024;

function ToolbarBtn({ onClick, active, disabled, title, children }: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} title={title}
      className={`h-8 w-8 inline-flex items-center justify-center rounded text-sm transition
        ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}
        disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImage = async (file: File) => {
    if (!ACCEPT.includes(file.type)) return toast({ title: 'JPG/PNG/WEBP/GIF only', variant: 'destructive' });
    if (file.size > MAX) return toast({ title: 'Max 5 MB', variant: 'destructive' });
    const path = `content/${crypto.randomUUID()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('featured-images').upload(path, file, { contentType: file.type });
    if (error) return toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    const { data } = supabase.storage.from('featured-images').getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl, alt: file.name }).run();
  };

  const addLink = () => {
    const url = window.prompt('Enter URL (https://…)', editor.getAttributes('link').href || 'https://');
    if (url === null) return;
    if (url === '') return editor.chain().focus().extendMarkRange('link').unsetLink().run();
    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border p-2 bg-muted/30 rounded-t-md">
      <ToolbarBtn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolbarBtn>
      <ToolbarBtn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolbarBtn>
      <ToolbarBtn title="Strike" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></ToolbarBtn>
      <span className="w-px h-5 bg-border mx-1" />
      <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolbarBtn>
      <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></ToolbarBtn>
      <ToolbarBtn title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolbarBtn>
      <ToolbarBtn title="Code" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="h-4 w-4" /></ToolbarBtn>
      <span className="w-px h-5 bg-border mx-1" />
      <ToolbarBtn title="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolbarBtn>
      <ToolbarBtn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolbarBtn>
      <span className="w-px h-5 bg-border mx-1" />
      <ToolbarBtn title="Link" active={editor.isActive('link')} onClick={addLink}><LinkIcon className="h-4 w-4" /></ToolbarBtn>
      <ToolbarBtn title="Insert image (upload)" onClick={() => fileRef.current?.click()}><ImageIcon className="h-4 w-4" /></ToolbarBtn>
      <input ref={fileRef} type="file" accept={ACCEPT.join(',')} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleImage(f); e.currentTarget.value = ''; }} />
      <span className="ml-auto flex items-center gap-1">
        <ToolbarBtn title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></ToolbarBtn>
        <ToolbarBtn title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></ToolbarBtn>
      </span>
    </div>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: {
  value: string; onChange: (html: string) => void; placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: 'rounded-md my-3 max-w-full h-auto' } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: 'text-primary underline', rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder: placeholder ?? 'Start writing your article…' }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none',
      },
    },
  });

  // Sync external value (e.g. when editing existing post loads)
  useEffect(() => {
    if (!editor) return;
    if (value && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return <div className="h-[500px] border border-border rounded-md animate-pulse bg-muted/20" />;

  return (
    <div className="border border-border rounded-md bg-background">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
