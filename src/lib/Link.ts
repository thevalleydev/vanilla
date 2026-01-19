import { html } from 'lit-html';
import type { TemplateResult } from 'lit-html';
import { useRouter } from '../composables';

interface LinkProps {
  href: string;
  children: TemplateResult | string;
  class?: string;
}

export function Link({
  href,
  children,
  class: className = '',
}: LinkProps): TemplateResult {
  const handleClick = (e: Event) => {
    e.preventDefault();
    const router = useRouter();
    router.navigate(href);
  };

  return html`<a href="${href}" @click=${handleClick} class=${className}>
    ${children}
  </a>`;
}
