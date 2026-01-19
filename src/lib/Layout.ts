import { html } from 'lit-html';
import type { TemplateResult } from 'lit-html';

interface LayoutProps {
  header: TemplateResult;
  footer: TemplateResult;
  children: TemplateResult;
}

export function Layout({ header, footer, children }: LayoutProps): TemplateResult {
  return html`
    <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      ${header}
      <main class="flex-1">
        ${children}
      </main>
      ${footer}
    </div>
  `;
}
