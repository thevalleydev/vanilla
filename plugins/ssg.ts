import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import http from 'http';
import handler from 'serve-handler';
import { chromium } from 'playwright';

interface SSGOptions {
  routes?: string[];
}

export function ssgPlugin(options: SSGOptions = {}): Plugin {
  let config: any;
  
  return {
    name: 'vite-plugin-ssg',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    
    async closeBundle() {
      if (config.command !== 'build') return;
      
      console.log('\n🔨 Starting SSG generation...\n');
      
      const outDir = config.build.outDir || 'dist';
      const distPath = path.resolve(config.root, outDir);
      const port = 4175;
      
      // Start a static file server for the built assets
      const server = http.createServer((req, res) => {
        return handler(req, res, {
          public: distPath,
          rewrites: [{ source: '**', destination: '/index.html' }],
        });
      });
      await new Promise<void>(resolve => server.listen(port, resolve));
      
      // Launch headless browser
      const browser = await chromium.launch({ headless: true });
      
      // Discover routes
      const routes = await discoverRoutes(config.root);
      console.log(`📍 Found ${routes.length} routes to render:\n${routes.map(r => `  - ${r}`).join('\n')}\n`);
      
      // For each route, create a pre-rendered HTML file
      for (const route of routes) {
        try {
          console.log(`  🎨 Rendering ${route}`);

          // Navigate and wait for the app to render
          const page = await browser.newPage();
          await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle' });

          // Wait for the page-specific content to render
          if (route === '/blog') {
            try {
              await page.getByRole('heading', { level: 2, name: /blog/i }).waitFor({ timeout: 3000 });
            } catch {
              await page.waitForTimeout(1000);
            }
          } else if (route.startsWith('/blog/')) {
            try {
              await page.getByRole('heading', { level: 1 }).waitFor({ timeout: 3000 });
            } catch {
              await page.waitForTimeout(1000);
            }
          } else {
            await page.waitForTimeout(500);
          }

          // Keep only the final render in #app (avoid duplicated layouts)
          await page.evaluate(() => {
            const app = document.querySelector('#app');
            if (app && app.children.length > 1) {
              const last = app.lastElementChild;
              if (last) app.innerHTML = last.outerHTML;
            }
          });
          
          // Grab rendered HTML
          let html = await page.content();
          let title = 'My Site';
          let description = '';
          let ogType = 'website';

          // Get metadata based on route
          if (route === '/') {
            title = 'Home - My Blog';
            description = 'A lightweight, reactive blog built with Vite, Vue Reactivity, and lit-html';
          } else if (route === '/blog') {
            title = 'Blog - My Blog';
            description = 'Read my latest articles about web development, frameworks, and programming';
            ogType = 'website';
          } else if (route.startsWith('/blog/')) {
            const slug = route.split('/').pop() || '';
            const postMeta = await getPostMetadata(config.root, slug);
            if (postMeta) {
              title = `${postMeta.title} - My Blog`;
              description = postMeta.excerpt || postMeta.title;
              ogType = 'article';
            }
          } else if (route === '/404') {
            title = '404 - Page Not Found';
            description = 'The page you are looking for could not be found';
          }

          // Update title
          html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

          // Build meta tags
          const metaTags = `
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="https://yourdomain.com${route}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />`;

          // Remove existing canonical links then inject meta and canonical
          html = html.replace(/<link rel="canonical"[^>]*>/g, '');
          html = html.replace('</head>', `${metaTags}
    <link rel="canonical" href="${route}" />
  </head>`);

          // Write to file
          const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
          const filePath = path.join(distPath, routePath);
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
          fs.writeFileSync(filePath, html);

          console.log(`  ✓ Created ${routePath}`);
          await page.close();
          
        } catch (error) {
          console.error(`  ✗ Failed to render ${route}:`, error);
        }
      }
      
      // Clean up
      await browser.close();
      await new Promise<void>(resolve => server.close(() => resolve()));
      
      console.log('\n✅ SSG generation complete!\n');
    }
  };
}

async function discoverRoutes(root: string): Promise<string[]> {
  const routes: string[] = ['/', '/blog', '/404'];
  
  // Discover blog post routes from markdown files
  const contentDir = path.join(root, 'src/content/posts');
  
  try {
    const files = fs.readdirSync(contentDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    for (const file of mdFiles) {
      const slug = file.replace('.md', '');
      routes.push(`/blog/${slug}`);
    }
  } catch (error) {
    console.warn('⚠️  Could not read content directory:', error);
  }
  
  return routes;
}

async function getPostMetadata(root: string, slug: string): Promise<{title: string; excerpt?: string} | null> {
  try {
    const filePath = path.join(root, 'src/content/posts', `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    
    return {
      title: data.title || slug,
      excerpt: data.excerpt,
    };
  } catch (error) {
    return null;
  }
}
