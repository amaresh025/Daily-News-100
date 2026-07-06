import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';

interface Env {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
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

function formatIsoDate(dateStr: string | null | undefined): string {
  if (!dateStr) return new Date().toISOString();
  try {
    return new Date(dateStr).toISOString();
  } catch (e) {
    return new Date().toISOString();
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
    return context.next();
  }

  const sitemapType = match[1]; // "sitemap" or "news-sitemap"
  const isIndex = sitemapParam === 'sitemap-index.xml';
  const pageNumStr = match[2];
  const pageNum = pageNumStr ? parseInt(pageNumStr, 10) : null;

  // Supabase connection keys configuration
  const supabaseUrl = context.env.VITE_SUPABASE_URL || context.env.SUPABASE_URL;
  const supabaseKey = context.env.VITE_SUPABASE_PUBLISHABLE_KEY || context.env.SUPABASE_ANON_KEY || context.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response("Supabase configuration missing on Cloudflare environment.", { status: 500 });
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
      return new Response(`Error querying posts count: ${countErr.message}`, { status: 500 });
    }

    const { data: categories, error: catErr } = await supabase
      .from('categories')
      .select('slug, updated_at, created_at');

    if (catErr) {
      return new Response(`Error querying categories: ${catErr.message}`, { status: 500 });
    }

    const staticCount = 7;
    const categoryCount = categories ? categories.length : 0;
    const totalArticles = articleCount || 0;
    const totalUrls = staticCount + categoryCount + totalArticles;

    // Check if we exceed 50,000 URLs limits
    const needsIndex = totalUrls > 50000;

    // Fetch latest updated date for overall lastmod fallbacks
    const { data: latestPost } = await supabase
      .from('posts')
      .select('updated_at, created_at')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const fallbackDate = new Date().toISOString();
    const latestDate = latestPost ? (latestPost.updated_at || latestPost.created_at || fallbackDate) : fallbackDate;

    // Handle sitemap index request (or regular sitemap.xml request when total > 50,000)
    if (isIndex || (sitemapParam === 'sitemap.xml' && needsIndex)) {
      const totalSitemaps = Math.ceil(totalUrls / LIMIT);
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      for (let i = 1; i <= totalSitemaps; i++) {
        xml += `  <sitemap>\n`;
        xml += `    <loc>${domain}/sitemap-${i}.xml</loc>\n`;
        xml += `    <lastmod>${formatIsoDate(latestDate)}</lastmod>\n`;
        xml += `  </sitemap>\n`;
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

    // Static pages details
    const staticPages = [
      { path: '', changefreq: 'hourly', priority: '1.0' },
      { path: '/latest', changefreq: 'monthly', priority: '0.6' },
      { path: '/about', changefreq: 'monthly', priority: '0.6' },
      { path: '/contact', changefreq: 'monthly', priority: '0.6' },
      { path: '/privacy', changefreq: 'monthly', priority: '0.6' },
      { path: '/terms', changefreq: 'monthly', priority: '0.6' },
      { path: '/faq', changefreq: 'monthly', priority: '0.6' },
    ];

    // Page 1 gets static pages & categories
    if (currentPage === 1) {
      for (const sp of staticPages) {
        urls.push({
          loc: `${domain}${sp.path}`,
          lastmod: formatIsoDate(latestDate),
          changefreq: sp.changefreq,
          priority: sp.priority,
        });
      }

      if (categories) {
        for (const cat of categories) {
          urls.push({
            loc: `${domain}/category/${cat.slug}`,
            lastmod: formatIsoDate(cat.updated_at || cat.created_at || latestDate),
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
        .select('slug, updated_at, created_at')
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
            lastmod: formatIsoDate(post.updated_at || post.created_at),
            changefreq: 'hourly',
            priority: '0.9',
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
