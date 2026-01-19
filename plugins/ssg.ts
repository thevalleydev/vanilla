import { Plugin } from 'vite';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

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
      
      // Discover routes
      const routes = await discoverRoutes(config.root);
      console.log(`📍 Found ${routes.length} routes to render:\n${routes.map(r => `  - ${r}`).join('\n')}\n`);
      
      // Read the index.html template
      const indexHtmlPath = path.join(distPath, 'index.html');
      const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
      
      // For each route, create a pre-rendered HTML file
      for (const route of routes) {
        try {
          console.log(`  🎨 Rendering ${route}`);
          
          // For now, just copy the base index.html
          // The actual rendering happens client-side on first load
          // This provides the basic HTML structure for SEO and faster initial load
          
          const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
          const filePath = path.join(distPath, routePath);
          
          // Ensure directory exists
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
          
          // Write HTML with proper meta tags for the route
          let html = indexHtml;
          
          // Update title based on route
          if (route === '/blog') {
            html = html.replace('<title>My Site</title>', '<title>Blog - My Blog</title>');
          } else if (route.startsWith('/blog/')) {
            const slug = route.split('/').pop();
            html = html.replace('<title>My Site</title>', `<title>${slug} - My Blog</title>`);
          } else if (route === '/404') {
            html = html.replace('<title>My Site</title>', '<title>404 - Page Not Found</title>');
          }
          
          // Add canonical URL
          html = html.replace('</head>', `  <link rel="canonical" href="${route}" />\n  </head>`);
          
          fs.writeFileSync(filePath, html);
          console.log(`  ✓ Created ${routePath}`);
          
        } catch (error) {
          console.error(`  ✗ Failed to render ${route}:`, error);
        }
      }
      
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
