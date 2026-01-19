import { html, render } from 'lit-html';
import type { TemplateResult } from 'lit-html';
import { useHead, useMarkdownPosts } from '../composables';
import { createJsonLd } from '../lib/jsonld';
import type { MarkdownPost } from '../types';
import { Layout } from '../lib/Layout';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Navigation } from '../components/Navigation';
import { Link } from '../lib/Link';

function BlogListPage(): TemplateResult {
  const { sortedPosts } = useMarkdownPosts();

  return html`
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-4xl font-bold mb-10 text-slate-900 dark:text-slate-100">Blog</h2>

      ${sortedPosts.value.length === 0
        ? html`<p class="text-slate-600 dark:text-slate-400">No posts yet.</p>`
        : html`
            <div class="space-y-12">
              ${sortedPosts.value.map(
                (post: MarkdownPost) =>
                  html`
                    <article class="border-b border-slate-200 dark:border-slate-800 pb-10 last:border-b-0">
                      <h3 class="text-2xl font-bold mb-3">
                        ${Link({
                          href: `/blog/${post.slug}`,
                          children: post.title,
                          class: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors',
                        })}
                      </h3>
                      <time class="text-slate-500 dark:text-slate-400 text-sm block mb-3"
                        >${new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</time
                      >
                      ${post.excerpt
                        ? html`<p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">${post.excerpt}</p>`
                        : ''}
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
                    </article>
                  `
              )}
            </div>
          `}
    </div>
  `;
}

export function render_page(container: HTMLElement): () => void {
  const { loadPosts } = useMarkdownPosts();

  const jsonLd = createJsonLd('WebPage')
    .add('name', 'Blog - My Blog')
    .add('description', 'Read my latest articles about web development, frameworks, and programming');

  // Load posts and render after
  loadPosts().then(() => {
    useHead({
      title: 'Blog - My Blog',
      description: 'Read my latest articles about web development, frameworks, and programming',
      ogTitle: 'Blog - My Blog',
      ogDescription: 'Read my latest articles about web development, frameworks, and programming',
      ogType: 'website',
      twitterCard: 'summary',
      jsonLd,
    });

    const template = Layout({
      header: html`${Header()} ${Navigation()}`,
      footer: Footer(),
      children: BlogListPage(),
    });
    render(template, container);
  });

  return () => {
    // Cleanup if needed
  };
}
