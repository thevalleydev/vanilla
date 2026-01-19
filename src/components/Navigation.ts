import { html } from 'lit-html';
import type { TemplateResult } from 'lit-html';
import { Link } from '../lib/Link';

export function Navigation(): TemplateResult {
  return html`
    <nav class="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-6">
        ${Link({
          href: '/',
          children: 'Home',
          class: 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors',
        })}
        ${Link({
          href: '/blog',
          children: 'Blog',
          class: 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors',
        })}
      </div>
    </nav>
  `;
}
