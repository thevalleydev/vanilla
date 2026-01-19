import { JsonLdBuilder } from '../../lib/jsonld';
import { useRouter } from './useRouter';

const BASE_PATH = import.meta.env.BASE_URL || '/';

interface HeadOptions {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'blog';
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  jsonLd?: JsonLdBuilder | JsonLdBuilder[];
}

export function useHead(options: HeadOptions = {}): void {
  const { 
    title, 
    description, 
    canonical: customCanonical, 
    ogTitle, 
    ogDescription, 
    ogImage, 
    ogType = 'website', 
    twitterCard, 
    twitterTitle, 
    twitterDescription, 
    twitterImage, 
    jsonLd 
  } = options;

  const { currentRoute } = useRouter();

  // Set title
  if (title) {
    document.title = title;
  }

  // Build canonical URL
  const canonical = customCanonical || currentRoute.value.path;
  const canonicalUrl = BASE_PATH === '/' ? canonical : `${BASE_PATH}${canonical}`.replace(/\/+/g, '/');
  
  // Remove existing canonical
  document.head.querySelector('link[rel="canonical"]')?.remove();
  
  // Add canonical
  const canonicalLink = document.createElement('link');
  canonicalLink.rel = 'canonical';
  canonicalLink.href = canonicalUrl;
  document.head.appendChild(canonicalLink);

  // Update/create meta description
  let descMeta = document.head.querySelector('meta[name="description"]') as HTMLMetaElement;
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.name = 'description';
    document.head.appendChild(descMeta);
  }
  if (description) {
    descMeta.content = description;
  }

  // Open Graph tags
  if (ogTitle || title) {
    updateOrCreateMeta('property', 'og:title', ogTitle || title!);
  }
  if (ogDescription || description) {
    updateOrCreateMeta('property', 'og:description', ogDescription || description!);
  }
  updateOrCreateMeta('property', 'og:type', ogType);
  updateOrCreateMeta('property', 'og:url', canonicalUrl);
  if (ogImage) {
    updateOrCreateMeta('property', 'og:image', ogImage);
  }

  // Twitter Card tags
  if (twitterCard) {
    updateOrCreateMeta('name', 'twitter:card', twitterCard);
  }
  if (twitterTitle || title) {
    updateOrCreateMeta('name', 'twitter:title', twitterTitle || title!);
  }
  if (twitterDescription || description) {
    updateOrCreateMeta('name', 'twitter:description', twitterDescription || description!);
  }
  if (twitterImage) {
    updateOrCreateMeta('name', 'twitter:image', twitterImage);
  }

  // JSON-LD
  if (jsonLd) {
    JsonLdBuilder.remove();
    const builders = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    builders.forEach(builder => builder.inject());
  }
}

/**
 * Update or create a meta tag
 */
function updateOrCreateMeta(attrName: string, attrValue: string, content: string): void {
  let meta = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attrName, attrValue);
    document.head.appendChild(meta);
  }
  meta.content = content;
}
