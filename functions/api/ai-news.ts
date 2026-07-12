/// <reference path="../global.d.ts" />
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/integrations/supabase/types';

interface Env {
  SUPABASE_URL?: string;
  VITE_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  // Handle CORS Preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Only allow GET and HEAD requests
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    return new Response(
      JSON.stringify({ error: 'Method Not Allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Allow': 'GET, HEAD, OPTIONS',
        },
      }
    );
  }

  // Supabase connection configuration following the existing pattern from [sitemap].ts
  const supabaseUrl = context.env.SUPABASE_URL || context.env.VITE_SUPABASE_URL;

  let urlProjectRef: string | null = null;
  if (supabaseUrl) {
    const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\./);
    if (urlMatch) {
      urlProjectRef = urlMatch[1];
    }
  }

  const getJwtProjectRef = (token: string | undefined): string | null => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64Url));
      return payload.ref || null;
    } catch {
      return null;
    }
  };

  const keyCandidates = [
    { name: 'SUPABASE_SERVICE_ROLE_KEY', val: context.env.SUPABASE_SERVICE_ROLE_KEY },
    { name: 'SUPABASE_ANON_KEY', val: context.env.SUPABASE_ANON_KEY },
    { name: 'VITE_SUPABASE_ANON_KEY', val: context.env.VITE_SUPABASE_ANON_KEY },
    { name: 'VITE_SUPABASE_PUBLISHABLE_KEY', val: context.env.VITE_SUPABASE_PUBLISHABLE_KEY },
  ];

  let supabaseKey: string | undefined;
  for (const candidate of keyCandidates) {
    if (!candidate.val) continue;
    const tokenRef = getJwtProjectRef(candidate.val);
    
    if (urlProjectRef && tokenRef && tokenRef !== urlProjectRef) {
      continue;
    }
    supabaseKey = candidate.val;
    break;
  }

  if (!supabaseKey) {
    for (const candidate of keyCandidates) {
      if (candidate.val) {
        supabaseKey = candidate.val;
        break;
      }
    }
  }

  if (!supabaseUrl || !supabaseKey) {
    const missing: string[] = [];
    if (!supabaseUrl) {
      missing.push('SUPABASE_URL / VITE_SUPABASE_URL');
    }
    if (!supabaseKey) {
      missing.push('SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY / VITE_SUPABASE_PUBLISHABLE_KEY');
    }
    return new Response(
      JSON.stringify({ error: `Missing environment variables: ${missing.join(' and ')}` }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  try {
    // 1. Fetch the AI category by slug 'ai'
    const { data: category, error: catErr } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'ai')
      .maybeSingle();

    if (catErr) {
      return new Response(
        JSON.stringify({ error: `Category query error: ${catErr.message}` }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // If the category does not exist, return an empty array
    if (!category) {
      return new Response(
        JSON.stringify([]),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 2. Fetch up to 6 published posts in the AI category
    const { data: posts, error: postsErr } = await supabase
      .from('posts')
      .select('id, title, excerpt, featured_image, slug, published_at')
      .eq('status', 'published')
      .or(`category_id.eq.${category.id},extra_category_ids.cs.{${category.id}}`)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(6);

    if (postsErr) {
      return new Response(
        JSON.stringify({ error: `Posts query error: ${postsErr.message}` }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 3. Format response according to requirements
    const formattedPosts = (posts || []).map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || '',
      image: post.featured_image || '',
      slug: post.slug,
      publishedAt: post.published_at || '',
      url: `https://dailynews100.com/blog/${post.slug}`,
    }));

    return new Response(
      JSON.stringify(formattedPosts),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
};
