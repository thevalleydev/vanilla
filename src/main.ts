import './styles/main.css';
import { useRouter, useMarkdownPosts } from './composables';

// Page modules
const pages = import.meta.glob<{ render_page: (container: HTMLElement) => () => void }>(
  './pages/**/*.ts'
);

interface PageModule {
  render_page: (container: HTMLElement) => () => void;
}

async function router() {
  const { currentRoute } = useRouter();
  const { loadPosts } = useMarkdownPosts();
  
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const prerenderRoute = document
    .querySelector('meta[name="x-prerender-route"]')
    ?.getAttribute('content');

  // Only clear if the pre-rendered route does not match the current route
  if (prerenderRoute && prerenderRoute !== currentRoute.value.path) {
    app.innerHTML = '';
  }

  // Load markdown posts
  await loadPosts();

  async function loadPage() {
    const path = currentRoute.value.path || '/';

    // Map routes to page files
    let pagePath = '';

    if (path === '/') {
      pagePath = './pages/home.ts';
    } else if (path === '/blog') {
      pagePath = './pages/blog.ts';
    } else if (path.startsWith('/blog/')) {
      pagePath = './pages/blog-post.ts';
    } else {
      pagePath = './pages/404.ts';
    }

    try {
      const loader = pages[pagePath];
      if (loader) {
        const module = (await loader()) as PageModule;
        module.render_page(app);
      } else {
        // Fallback to 404
        const loader = pages['./pages/404.ts'];
        if (loader) {
          const module = (await loader()) as PageModule;
          module.render_page(app);
        }
      }
    } catch (error) {
      console.error('Failed to load page:', error);
      app.innerHTML = '<div class="p-4">Error loading page</div>';
    }
  }

  // Load initial page
  await loadPage();

  // Listen for route changes
  window.addEventListener('popstate', loadPage);
}

router();
