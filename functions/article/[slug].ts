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
  ASSETS?: any;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const slug = context.params.slug as string;

  // Supabase connection configuration
  const supabaseUrl = context.env.SUPABASE_URL || context.env.VITE_SUPABASE_URL;

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

  let urlProjectRef: string | null = null;
  if (supabaseUrl) {
    const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\./);
    if (urlMatch) {
      urlProjectRef = urlMatch[1];
    }
  }

  const keyCandidates = [
    { name: 'SUPABASE_SERVICE_ROLE_KEY', val: context.env.SUPABASE_SERVICE_ROLE_KEY },
    { name: 'SUPABASE_ANON_KEY', val: context.env.SUPABASE_ANON_KEY },
    { name: 'VITE_SUPABASE_ANON_KEY', val: context.env.VITE_SUPABASE_ANON_KEY },
    { name: 'VITE_SUPABASE_PUBLISHABLE_KEY', val: context.env.VITE_SUPABASE_PUBLISHABLE_KEY }
  ];

  let supabaseKey: string | undefined;
  for (const candidate of keyCandidates) {
    if (!candidate.val) continue;
    const tokenRef = getJwtProjectRef(candidate.val);
    if (urlProjectRef && tokenRef && tokenRef !== urlProjectRef) continue;
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
    return Response.redirect(new URL(`/blog/${slug}`, context.request.url).toString(), 301);
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .maybeSingle();

    if (error || !post) {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article not found | DailyNews100</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap" rel="stylesheet">
    <style>
      :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --muted-foreground: 215.4 16.3% 46.9%;
        --border: 214.3 31.8% 91.4%;
        --primary: 24 100% 50%;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --muted-foreground: 215 20.2% 65.1%;
          --border: 217.2 32.6% 17.5%;
        }
      }
      body {
        margin: 0;
        font-family: 'DM Sans', -apple-system, sans-serif;
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
      .container {
        text-align: center;
        padding: 2rem;
      }
      h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
      }
      a {
        color: hsl(var(--primary));
        text-decoration: none;
        font-weight: 500;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
</head>
<body>
    <div class="container">
        <h1>Article not found</h1>
        <a href="/">← Back to home</a>
    </div>
</body>
</html>`,
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      );
    }

    return Response.redirect(new URL(`/blog/${slug}`, context.request.url).toString(), 301);
  } catch (err) {
    return Response.redirect(new URL(`/blog/${slug}`, context.request.url).toString(), 301);
  }
};
