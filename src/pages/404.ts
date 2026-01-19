import { html, render } from 'lit-html';
import type { TemplateResult } from 'lit-html';
import { useTitle } from '../composables';
import { Layout } from '../lib/Layout';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Navigation } from '../components/Navigation';
import { Link } from '../lib/Link';

function NotFoundPage(): TemplateResult {
  return html`
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 class="text-7xl font-bold mb-4 text-slate-900 dark:text-slate-100">404</h2>
      <p class="text-2xl text-slate-600 dark:text-slate-400 mb-8">Page not found</p>
      <p>
        ${Link({
          href: '/',
          children: 'Go home',
          class: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-lg underline',
        })}
      </p>
    </div>
  `;
}

export function render_page(container: HTMLElement): () => void {
  useTitle('404 - Page Not Found');

  const template = Layout({
    header: html`${Header()} ${Navigation()}`,
    footer: Footer(),
    children: NotFoundPage(),
  });

  render(template, container);

  return () => {
    // Cleanup if needed
  };
}
