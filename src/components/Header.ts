import { html } from 'lit-html';
import type { TemplateResult } from 'lit-html';
import { ThemeToggle } from './ThemeToggle';

export function Header(): TemplateResult {
  return html`
    <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 transition-colors">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">My Blog</h1>
        ${ThemeToggle()}
      </div>
    </header>
  `;
}
