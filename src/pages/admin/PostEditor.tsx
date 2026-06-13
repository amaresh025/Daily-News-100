import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const MAIN_CATEGORY_SLUGS = ['politics', 'accidents', 'business', 'sports', 'entertainment', 'technology', 'health'];

interface FormState {
  title: string; slug: string; excerpt: string; content: string;
  featured_image: string; author_name: string; category_id: string;
  extra_category_ids: string[];
  status: 'draft' | 'published'; is_breaking: boolean; is_trending: boolean;
  meta_title: string; meta_description: string;
}
const empty: FormState = {
  title: '', slug: '', excerpt: '', content: '', featured_image: '',
  author_name: 'DailyNews100 Desk', category_id: '', extra_category_ids: [], status: 'draft',
  is_breaking: false, is_trending: false, meta_title: '', meta_description: '',
};


const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

export default function PostEditor() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(empty);
  const [cats, setCats] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  const mainCats = useMemo(() => cats.filter(c => MAIN_CATEGORY_SLUGS.includes(c.slug)), [cats]);
  const otherCats = useMemo(() => cats.filter(c => !MAIN_CATEGORY_SLUGS.includes(c.slug)), [cats]);

  useEffect(() => {
    supabase.from('categories').select('id,name,slug').order('name').then(({ data }) => setCats(data ?? []));
    if (!isNew) {
      supabase.from('posts').select('*').eq('id', id).maybeSingle().then(({ data }) => {
        if (data) setForm({
          title: data.title, slug: data.slug, excerpt: data.excerpt ?? '', content: data.content ?? '',
          featured_image: data.featured_image ?? '', author_name: data.author_name,
          category_id: data.category_id ?? '',
          extra_category_ids: (data as any).extra_category_ids ?? [],
          status: data.status as 'draft' | 'published',
          is_breaking: data.is_breaking, is_trending: data.is_trending,
          meta_title: data.meta_title ?? '', meta_description: data.meta_description ?? '',
        });
        setLoading(false);
      });
    }

  }, [id, isNew]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return toast({ title: 'Title and content required', variant: 'destructive' });
    setBusy(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      category_id: form.category_id || null,
      extra_category_ids: form.extra_category_ids.filter(x => x && x !== form.category_id),
      featured_image: form.featured_image || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    };

    const res = isNew
      ? await supabase.from('posts').insert(payload).select('id').single()
      : await supabase.from('posts').update(payload).eq('id', id).select('id').single();
    setBusy(false);
    if (res.error) return toast({ title: 'Save failed', description: res.error.message, variant: 'destructive' });
    toast({ title: isNew ? 'Post created' : 'Post updated' });
    // Keep navbar selection in sync with what was chosen in editor.
    // After save, open the public category page for the selected main category.
    if (form.category_id) {
      const { data: chosen } = await supabase
        .from('categories')
        .select('slug')
        .eq('id', form.category_id)
        .maybeSingle();

      const slug = (chosen as any)?.slug as string | undefined;
      if (slug) return navigate(`/category/${slug}`);
    }
    navigate('/admin/posts');
  };

  if (loading) return <AdminLayout><div className="text-muted-foreground">Loading…</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="sm"><Link to="/admin/posts"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link></Button>
        <h1 className="text-3xl font-extrabold">{isNew ? 'New Post' : 'Edit Post'}</h1>
      </div>
      <form onSubmit={save} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2"><Label>Title *</Label>
            <Input value={form.title} maxLength={200} required
              onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) }))} />
          </div>
          <div className="space-y-2"><Label>Slug</Label>
            <Input value={form.slug} maxLength={120} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} />
          </div>
          <div className="space-y-2"><Label>Excerpt</Label>
            <Textarea rows={2} maxLength={300} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
          </div>
          <div className="space-y-2"><Label>Content *</Label>
            <RichTextEditor value={form.content} onChange={html => setForm(f => ({ ...f, content: html }))} placeholder="Write the article. Use the toolbar for headings, bold, lists, links, and images." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2"><Label>SEO Title</Label>
              <Input value={form.meta_title} maxLength={70} onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))} />
            </div>
            <div className="space-y-2"><Label>SEO Description</Label>
              <Input value={form.meta_description} maxLength={160} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <Label>Status</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Saving…' : 'Save Post'}</Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <Label>Featured Image</Label>
            <ImageUpload value={form.featured_image || null} onChange={url => setForm(f => ({ ...f, featured_image: url ?? '' }))} />
            <Input placeholder="…or paste image URL" value={form.featured_image}
              onChange={e => setForm(f => ({ ...f, featured_image: e.target.value }))} />
          </div>

          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <Label>Main Category</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
              <option value="">— None —</option>
              {mainCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Label>Additional Categories (optional)</Label>
            <div className="space-y-1 max-h-40 overflow-auto border border-border rounded-md p-2">
              {otherCats.filter(c => c.id !== form.category_id).map(c => (
                <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.extra_category_ids.includes(c.id)}
                    onChange={e => setForm(f => ({
                      ...f,
                      extra_category_ids: e.target.checked
                        ? [...f.extra_category_ids, c.id]
                        : f.extra_category_ids.filter(x => x !== c.id),
                    }))}
                  />
                  {c.name}
                </label>
              ))}
              {otherCats.length === 0 && <div className="text-xs text-muted-foreground">Add more categories to enable extras.</div>}
            </div>
            <Label>Author</Label>

            <Input value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} />
            <div className="flex items-center justify-between"><Label htmlFor="br">Breaking</Label>
              <Switch id="br" checked={form.is_breaking} onCheckedChange={v => setForm(f => ({ ...f, is_breaking: v }))} />
            </div>
            <div className="flex items-center justify-between"><Label htmlFor="tr">Trending</Label>
              <Switch id="tr" checked={form.is_trending} onCheckedChange={v => setForm(f => ({ ...f, is_trending: v }))} />
            </div>
          </div>
        </aside>
      </form>
    </AdminLayout>
  );
}
