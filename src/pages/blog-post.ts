import { html, render } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import type { TemplateResult } from 'lit-html';
import { useHead, useMarkdownPosts, useRouter } from '../composables';
import { createJsonLd } from '../lib/jsonld';
import { Layout } from '../lib/Layout';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Navigation } from '../components/Navigation';
import { Link } from '../lib/Link';

function BlogPostPage(): TemplateResult {
  const router = useRouter();
  const { getPostBySlug } = useMarkdownPosts();

  const slug = router.currentRoute.value.path.split('/')[2];
  const post = getPostBySlug(slug);

  if (!post) {
    return html`
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 class="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Post not found</h2>
        <p class="text-slate-600 dark:text-slate-400">
          ${Link({
            href: '/blog',
            children: 'Back to blog',
            class: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline',
          })}
        </p>
      </div>
    `;
  }

  return html`
    <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
        <h1 class="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">${post.title}</h1>
        <div class="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <time class="text-sm">${new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</time>
          ${post.tags && post.tags.length > 0
            ? html`
                <div class="flex flex-wrap gap-2">
                  ${post.tags.map(
                    (tag: string) =>
                      html`<span class="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full"
                        >${tag}</span
                      >`
                  )}
                </div>
              `
            : ''}
        </div>
      </header>

      <div class="prose prose-slate dark:prose-invert max-w-none mb-12">
        ${unsafeHTML(post.content)}
      </div>

      <div class="border-t border-slate-200 dark:border-slate-800 pt-8">
        ${Link({
          href: '/blog',
          children: '← Back to Blog',
          class: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors',
        })}
      </div>
    </article>
  `;
}

export function render_page(container: HTMLElement): () => void {
  const router = useRouter();
  const { getPostBySlug } = useMarkdownPosts();

  const slug = router.currentRoute.value.path.split('/')[2];
  const post = getPostBySlug(slug);

  if (post) {
    const jsonLd = createJsonLd('BlogPosting')
      .addArticle(post.title, post.excerpt || '')
      .addDates(post.date)
      .add('author', {
        '@type': 'Person',
        name: 'Your Blog',
      });

    useHead({
      title: `${post.title} - My Blog`,
      description: post.excerpt || post.title,
      ogTitle: post.title,
      ogDescription: post.excerpt || post.title,
      ogType: 'article',
      twitterCard: 'summary',
      jsonLd,
    });
  } else {
    useHead({
      title: '404 - Page Not Found',
      description: 'The page you are looking for does not exist',
    });
  }

  const template = Layout({
    header: html`${Header()} ${Navigation()}`,
    footer: Footer(),
    children: BlogPostPage(),
  });

  render(template, container);

  return () => {
    // Cleanup if needed
  };
}
