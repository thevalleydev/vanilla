import { html, render } from 'lit-html';
import type { TemplateResult } from 'lit-html';
import { useHead } from '../composables';
import { createJsonLd } from '../lib/jsonld';
import { Layout } from '../lib/Layout';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Navigation } from '../components/Navigation';
import { Link } from '../lib/Link';

function HomePage(): TemplateResult {
  return html`
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100">Welcome</h2>
      <div class="prose prose-slate dark:prose-invert max-w-none">
        <p class="text-xl text-slate-600 dark:text-slate-400 mb-6">
          A lightweight, reactive blog built with modern web technologies.
        </p>
        <p class="text-lg text-slate-600 dark:text-slate-400">
          Check out the ${Link({
            href: '/blog',
            children: 'blog',
            class: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline',
          })} to explore articles.
        </p>
      </div>
    </div>
  `;
}

export function render_page(container: HTMLElement): () => void {
  const jsonLd = createJsonLd('WebPage')
    .add('name', 'Home - My Blog')
    .add('description', 'A lightweight, reactive blog built with Vite, Vue Reactivity, and lit-html');

  useHead({
    title: 'Home - My Blog',
    description: 'A lightweight, reactive blog built with Vite, Vue Reactivity, and lit-html',
    ogTitle: 'Home - My Blog',
    ogDescription: 'A lightweight, reactive blog built with modern web technologies',
    ogType: 'website',
    twitterCard: 'summary',
    jsonLd,
  });

  const template = Layout({
    header: html`${Header()} ${Navigation()}`,
    footer: Footer(),
    children: HomePage(),
  });

  render(template, container);

  return () => {
    // Cleanup if needed
  };
}
