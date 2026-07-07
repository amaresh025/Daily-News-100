import { useRef, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sanitizeHtml } from '@/lib/sanitize';
import {
  Bold, Italic, Underline, Strikethrough, Heading2, Heading3, Heading4,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon,
  Heading, Table, Braces, Minimize2, Eye, EyeOff, LayoutGrid, FileCode, Check, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX = 5 * 1024 * 1024;

interface HtmlEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function HtmlEditor({ value, onChange, placeholder }: HtmlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  // Preview configuration states
  const [previewMode, setPreviewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [uploading, setUploading] = useState(false);
  const [sanitizedHtmlVal, setSanitizedHtmlVal] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync / sanitize preview value
  useEffect(() => {
    setSanitizedHtmlVal(sanitizeHtml(value));
  }, [value]);

  const insertTextAtCursor = (textBefore: string, textAfter = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = textBefore + selectedText + textAfter;
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    
    onChange(newValue);

    // Keep focus and reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + textBefore.length + selectedText.length + textAfter.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const handleImageUpload = async (file: File) => {
    if (!ACCEPT.includes(file.type)) {
      return toast({ title: 'Invalid image format', description: 'JPG, PNG, WEBP, and GIF only', variant: 'destructive' });
    }
    if (file.size > MAX) {
      return toast({ title: 'Image too large', description: 'Maximum allowed size is 5MB', variant: 'destructive' });
    }
    
    setUploading(true);
    try {
      const path = `content/${crypto.randomUUID()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage
        .from('featured-images')
        .upload(path, file, { contentType: file.type });

      if (error) throw error;

      const { data } = supabase.storage.from('featured-images').getPublicUrl(path);
      
      const imgTag = `<img src="${data.publicUrl}" alt="${file.name.split('.')[0]}" class="w-full rounded-lg my-6 aspect-video object-cover" />\n`;
      insertTextAtCursor(imgTag);
      toast({ title: 'Image uploaded successfully' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const insertLink = () => {
    const url = window.prompt('Enter link URL (e.g., https://example.com):', 'https://');
    if (url === null) return;
    insertTextAtCursor(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>');
  };

  const insertTable = () => {
    const tableSkeleton = `
<table class="w-full border-collapse border border-border my-6">
  <thead>
    <tr class="bg-muted">
      <th class="border border-border p-2">Header 1</th>
      <th class="border border-border p-2">Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-border p-2">Data 1</td>
      <td class="border border-border p-2">Data 2</td>
    </tr>
  </tbody>
</table>
`;
    insertTextAtCursor(tableSkeleton);
  };

  const insertIframe = () => {
    const embedSkeleton = `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="100%" height="450" class="w-full rounded-md border-0 my-6" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n`;
    insertTextAtCursor(embedSkeleton);
  };

  return (
    <div className="flex flex-col border border-border rounded-lg bg-background shadow-lg overflow-hidden transition-all duration-300">
      
      {/* Editor Layout Toolbar & View Toggles */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/20 p-2 gap-2">
        {/* Editor controls */}
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<strong>', '</strong>')} title="Bold (<strong>)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<em>', '</em>')} title="Italic (<em>)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<u>', '</u>')} title="Underline (<u>)"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<s>', '</s>')} title="Strikethrough (<s>)"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<h2>', '</h2>')} title="Heading 2 (<h2>)"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<h3>', '</h3>')} title="Heading 3 (<h3>)"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<h4>', '</h4>')} title="Heading 4 (<h4>)"
          >
            <Heading4 className="h-4 w-4" />
          </Button>
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<p>', '</p>')} title="Paragraph (<p>)"
          >
            <Heading className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-5 bg-border mx-1" />

          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<blockquote>', '</blockquote>')} title="Blockquote (<blockquote>)"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<pre><code>', '</code></pre>')} title="Code Block (<pre><code>)"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<ul>\n  <li>', '</li>\n</ul>')} title="Unordered List (<ul>)"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<ol>\n  <li>', '</li>\n</ol>')} title="Ordered List (<ol>)"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />
          
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={insertLink} title="Hyperlink (<a>)"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => fileRef.current?.click()} title="Insert Image (Upload)"
            disabled={uploading}
          >
            {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          </Button>
          <input
            ref={fileRef} type="file" accept={ACCEPT.join(',')} className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.currentTarget.value = '';
            }}
          />

          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={insertTable} title="Insert Table (<table>)"
          >
            <Table className="h-4 w-4" />
          </Button>
          
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={insertIframe} title="Embed Iframe (<iframe>)"
          >
            <Braces className="h-4 w-4" />
          </Button>

          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<hr />\n')} title="Horizontal Rule (<hr />)"
          >
            <Minimize2 className="h-4 w-4 rotate-45" />
          </Button>
          <Button
            type="button" variant="ghost" size="icon" className="h-8 w-8 text-foreground"
            onClick={() => insertTextAtCursor('<br />\n')} title="Line Break (<br />)"
          >
            <span className="text-xs font-bold font-sans">BR</span>
          </Button>
        </div>

        {/* View Mode controls (Split Screen / HTML Editor Only / Live Preview Only) */}
        <div className="flex items-center bg-muted/60 p-1 rounded-md border border-border">
          <Button
            type="button" variant={previewMode === 'editor' ? 'default' : 'ghost'} size="sm" className="h-7 px-2.5 text-xs gap-1.5"
            onClick={() => setPreviewMode('editor')}
          >
            <FileCode className="h-3 w-3" />
            HTML Editor
          </Button>
          <Button
            type="button" variant={previewMode === 'split' ? 'default' : 'ghost'} size="sm" className="h-7 px-2.5 text-xs gap-1.5 hidden md:flex"
            onClick={() => setPreviewMode('split')}
          >
            <LayoutGrid className="h-3 w-3" />
            Split View
          </Button>
          <Button
            type="button" variant={previewMode === 'preview' ? 'default' : 'ghost'} size="sm" className="h-7 px-2.5 text-xs gap-1.5"
            onClick={() => setPreviewMode('preview')}
          >
            <Eye className="h-3 w-3" />
            Live Preview
          </Button>
        </div>
      </div>

      {/* Main Working Panel */}
      <div className={`grid ${previewMode === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'} bg-background`}>
        
        {/* Editor Area */}
        <div className={`flex flex-col border-r border-border ${previewMode === 'preview' ? 'hidden' : 'block'}`}>
          <div className="flex items-center justify-between bg-muted/10 px-4 py-1.5 border-b border-border text-xs text-muted-foreground uppercase font-bold tracking-wider select-none">
            <span>HTML Code Editor</span>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">RAW Mode</span>
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || 'Start writing raw HTML content...'}
            className="w-full min-h-[500px] h-[600px] p-4 font-mono text-sm leading-relaxed focus:outline-none bg-background text-foreground resize-y selection:bg-primary/20 selection:text-foreground"
          />
        </div>

        {/* Live Preview Area */}
        <div className={`flex flex-col bg-muted/5 ${previewMode === 'editor' ? 'hidden' : 'block'}`}>
          <div className="flex items-center justify-between bg-muted/10 px-4 py-1 border-b border-border text-xs text-muted-foreground uppercase font-bold tracking-wider select-none">
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-emerald-500" />
              Live Preview
            </span>
            {/* Viewport size simulator for desktop/mobile preview */}
            <div className="flex items-center gap-1">
              <Button
                type="button" size="sm" variant={viewportMode === 'desktop' ? 'secondary' : 'ghost'}
                className="h-6 px-2 text-[10px]" onClick={() => setViewportMode('desktop')}
              >
                Desktop
              </Button>
              <Button
                type="button" size="sm" variant={viewportMode === 'mobile' ? 'secondary' : 'ghost'}
                className="h-6 px-2 text-[10px]" onClick={() => setViewportMode('mobile')}
              >
                Mobile (375px)
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-auto bg-muted/20 flex justify-center items-start min-h-[500px]">
            <div
              className={`bg-background shadow-md border border-border/60 rounded-md p-6 overflow-auto transition-all duration-300 w-full min-h-[460px] max-h-[580px]
                ${viewportMode === 'mobile' ? 'max-w-[375px]' : 'max-w-none'}
              `}
            >
              {/* Dynamic rendering container matching exactly the website's prose style */}
              <div 
                className="prose prose-lg max-w-none text-foreground dark:prose-invert article-content
                  prose-headings:text-foreground prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-ul:text-muted-foreground prose-li:text-muted-foreground
                  prose-img:rounded-lg prose-img:my-6"
                dangerouslySetInnerHTML={{ __html: sanitizedHtmlVal || '<p class="text-muted-foreground italic">Nothing to preview yet. Start typing HTML...</p>' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
