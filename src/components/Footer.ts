import { html } from 'lit-html';
import type { TemplateResult } from 'lit-html';

export function Footer(): TemplateResult {
  return html`
    <footer class="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-auto transition-colors">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-600 dark:text-slate-400">
        <p>&copy; ${new Date().getFullYear()} My Blog. Built with Vite + Vue Reactivity + lit-html.</p>
      </div>
    </footer>
  `;
}
