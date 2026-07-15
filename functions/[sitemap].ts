/// <reference path="./global.d.ts" />
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';

interface Env {
  SUPABASE_URL?: string;
  VITE_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  ASSETS?: any;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function formatIsoDate(dateStr: string | null | undefined, fallbackDate: string = '2026-07-13T00:00:00Z'): string {
  if (!dateStr) return fallbackDate;
  try {
    return new Date(dateStr).toISOString().split('.')[0] + 'Z';
  } catch (e) {
    return fallbackDate;
  }
}

// Separate helper for Google News sitemaps to decouple changes
async function generateNewsSitemap(supabase: any, domain: string): Promise<Response> {
  // Google News sitemap must only include articles published in the last 48 hours
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select('title, slug, published_at')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .gte('published_at', fortyEightHoursAgo)
    .order('published_at', { ascending: false })
    .limit(1000); // Google News limits sitemaps to 1,000 URLs

  if (error) {
    return new Response(`Error querying news posts: ${error.message}`, { status: 500 });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  if (posts) {
    for (const post of posts) {
      const pubDate = formatIsoDate(post.published_at);
      xml += `  <url>\n`;
      xml += `    <loc>${domain}/blog/${escapeXml(post.slug)}</loc>\n`;
      xml += `    <news:news>\n`;
      xml += `      <news:publication>\n`;
      xml += `        <news:name>DailyNews100</news:name>\n`;
      xml += `        <news:language>en</news:language>\n`;
      xml += `      </news:publication>\n`;
      xml += `      <news:publication_date>${pubDate}</news:publication_date>\n`;
      xml += `      <news:title>${escapeXml(post.title)}</news:title>\n`;
      xml += `    </news:news>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const sitemapParam = context.params.sitemap as string;
  
  // Regex to match:
  // - sitemap.xml
  // - sitemap-index.xml
  // - sitemap-[digits].xml
  // - news-sitemap.xml
  const sitemapRegex = /^(sitemap|news-sitemap)(?:-index|-(\d+))?\.xml$/;
  const match = sitemapParam.match(sitemapRegex);
  
  if (!match) {
    // Pass execution to standard routing (SPA index.html / static files)
    const url = new URL(context.request.url);
    const path = url.pathname;
    const hasExtension = path.includes('.') && !path.endsWith('/');
    if (!hasExtension) {
      return context.env.ASSETS.fetch(new URL('/', context.request.url));
    }
    return context.next();
  }

  const sitemapType = match[1]; // "sitemap" or "news-sitemap"
  const isIndex = sitemapParam === 'sitemap-index.xml';
  const pageNumStr = match[2];
  const pageNum = pageNumStr ? parseInt(pageNumStr, 10) : null;

  // Supabase connection keys configuration with correct priority:
  // URL: SUPABASE_URL -> VITE_SUPABASE_URL
  // Key: SUPABASE_SERVICE_ROLE_KEY -> SUPABASE_ANON_KEY -> VITE_SUPABASE_ANON_KEY -> VITE_SUPABASE_PUBLISHABLE_KEY (fallback)
  const supabaseUrl = context.env.SUPABASE_URL || context.env.VITE_SUPABASE_URL;

  let urlProjectRef: string | null = null;
  if (supabaseUrl) {
    const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\./);
    if (urlMatch) {
      urlProjectRef = urlMatch[1];
    }
  }

  // Helper to extract project ref from JWT payload
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
    { name: 'VITE_SUPABASE_PUBLISHABLE_KEY', val: context.env.VITE_SUPABASE_PUBLISHABLE_KEY }
  ];

  let supabaseKey: string | undefined;
  for (const candidate of keyCandidates) {
    if (!candidate.val) continue;
    const tokenRef = getJwtProjectRef(candidate.val);
    
    // If a project ref is parsed from the URL, prioritize matching keys to filter out mismatched global system envs
    if (urlProjectRef && tokenRef && tokenRef !== urlProjectRef) {
      continue;
    }
    supabaseKey = candidate.val;
    break;
  }

  // Fallback: If no project-matched key is found, fall back to the first defined key
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
    return new Response(`Missing environment variables: ${missing.join(' and ')}`, { status: 500 });
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  const domain = 'https://dailynews100.com';
  const LIMIT = 45000; // Safe threshold under 50,000 URLs limit

  try {
    // If Google News Sitemap requested, delegate to its dedicated function
    if (sitemapType === 'news-sitemap') {
      return generateNewsSitemap(supabase, domain);
    }

    // 1. Get total counts
    const { count: articleCount, error: countErr } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString());

    if (countErr) {
      return new Response(`Error querying posts count: ${JSON.stringify(countErr)}`, { status: 500 });
    }

    const { data: categories, error: catErr } = await supabase
      .from('categories')
      .select('slug, updated_at, created_at');

    if (catErr) {
      return new Response(`Error querying categories: ${catErr.message}`, { status: 500 });
    }

    const staticPages = [
      { path: '', changefreq: 'daily', priority: '1.0' },
      { path: '/latest', changefreq: 'monthly', priority: '0.6' },
      { path: '/about', changefreq: 'monthly', priority: '0.6' },
      { path: '/contact', changefreq: 'monthly', priority: '0.6' },
      { path: '/privacy', changefreq: 'monthly', priority: '0.6' },
      { path: '/terms', changefreq: 'monthly', priority: '0.6' },
      { path: '/disclaimer', changefreq: 'monthly', priority: '0.6' },
      { path: '/faq', changefreq: 'monthly', priority: '0.6' },
    ];

    const staticCount = staticPages.length;
    const categoryCount = categories ? categories.length : 0;
    const totalArticles = articleCount || 0;
    const totalUrls = staticCount + categoryCount + totalArticles;

    // Check if we exceed 50,000 URLs limits
    const needsIndex = totalUrls > 50000;

    // Fetch latest updated date for overall lastmod fallbacks
    const { data: latestPost } = await supabase
      .from('posts')
      .select('updated_at, published_at')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const defaultFallbackDate = '2026-07-13T00:00:00Z';
    const latestDbDate = latestPost ? (latestPost.updated_at || latestPost.published_at || defaultFallbackDate) : defaultFallbackDate;

    // Handle sitemap index request (or regular sitemap.xml request when total > 50,000)
    if (isIndex || (sitemapParam === 'sitemap.xml' && needsIndex)) {
      const totalSitemaps = Math.ceil(totalUrls / LIMIT);
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      for (let i = 1; i <= totalSitemaps; i++) {
        xml += `  <sitemap>\n`;
        xml += `    <loc>${domain}/sitemap-${i}.xml</loc>\n`;
        xml += `    <lastmod>${formatIsoDate(latestDbDate, defaultFallbackDate)}</lastmod>\n`;
        xml += `    </sitemap>\n`;
      }
      xml += `</sitemapindex>\n`;

      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    // Handle actual sitemaps
    let currentPage = 1;
    if (pageNum !== null) {
      currentPage = pageNum;
    } else if (sitemapParam !== 'sitemap.xml') {
      return new Response("Not Found", { status: 404 });
    }

    // Build URLs list for current chunk
    const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

    // Page 1 gets static pages & categories
    if (currentPage === 1) {
      for (const sp of staticPages) {
        urls.push({
          loc: `${domain}${sp.path}`,
          lastmod: formatIsoDate(latestDbDate, defaultFallbackDate),
          changefreq: sp.changefreq,
          priority: sp.priority,
        });
      }

      if (categories) {
        for (const cat of categories) {
          urls.push({
            loc: `${domain}/category/${cat.slug}`,
            lastmod: formatIsoDate(cat.updated_at || cat.created_at, latestDbDate),
            changefreq: 'daily',
            priority: '0.8',
          });
        }
      }
    }

    // Dynamic posts slice
    const firstPageNonArticles = staticCount + categoryCount;
    let articleStart = 0;
    let articleEnd = 0;

    if (currentPage === 1) {
      articleStart = 0;
      articleEnd = LIMIT - firstPageNonArticles - 1;
    } else {
      articleStart = (currentPage - 1) * LIMIT - firstPageNonArticles;
      articleEnd = currentPage * LIMIT - firstPageNonArticles - 1;
    }

    if (articleStart < totalArticles) {
      const { data: posts, error: postsErr } = await supabase
        .from('posts')
        .select('slug, updated_at, published_at')
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .range(articleStart, articleEnd);

      if (postsErr) {
        return new Response(`Error querying posts slice: ${postsErr.message}`, { status: 500 });
      }

      if (posts) {
        for (const post of posts) {
          urls.push({
            loc: `${domain}/blog/${post.slug}`,
            lastmod: formatIsoDate(post.updated_at || post.published_at, latestDbDate),
            changefreq: 'weekly',
            priority: '0.7',
          });
        }
      }
    }

    // Output formatted XML sitemap
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const url of urls) {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(url.loc)}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += `  </url>\n`;
    }
    xml += `</urlset>\n`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (err: any) {
    return new Response(`Server Error during sitemap generation: ${err.message || err}`, { status: 500 });
  }
};
