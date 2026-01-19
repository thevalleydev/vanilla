export type JsonLdType = 
  | 'WebPage'
  | 'WebSite'
  | 'Article'
  | 'BlogPosting'
  | 'Person'
  | 'Organization'
  | 'BreadcrumbList'
  | 'NewsArticle'
  | 'CreativeWork';

export type JsonLdObject = Record<string, any>;

export class JsonLdBuilder {
  private data: JsonLdObject;

  constructor(type: JsonLdType, context = 'https://schema.org') {
    this.data = {
      '@context': context,
      '@type': type,
    };
  }

  add<K extends string>(key: K, value: any): this {
    (this.data as any)[key] = value;
    return this;
  }

  addMultiple(properties: Record<string, any>): this {
    Object.entries(properties).forEach(([key, value]) => {
      this.add(key, value);
    });
    return this;
  }

  addAuthor(name: string, url?: string): this {
    (this.data as any).author = {
      '@type': 'Person',
      name,
      ...(url && { url }),
    };
    return this;
  }

  addPublisher(name: string, logoUrl?: string): this {
    (this.data as any).publisher = {
      '@type': 'Organization',
      name,
      ...(logoUrl && {
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        },
      }),
    };
    return this;
  }

  addArticle(headline: string, description?: string): this {
    this.add('headline', headline);
    if (description) this.add('description', description);
    return this;
  }

  addImage(images: string | string[]): this {
    this.add('image', Array.isArray(images) ? images : [images]);
    return this;
  }

  addDates(published: string, modified?: string): this {
    this.add('datePublished', published);
    if (modified) this.add('dateModified', modified);
    return this;
  }

  static breadcrumbs(items: Array<{ name: string; url?: string }>): JsonLdObject {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        ...(item.url && { item: item.url }),
      })),
    };
  }

  build(): JsonLdObject {
    return this.data;
  }

  toJSON(): string {
    return JSON.stringify(this.data);
  }

  inject(): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = this.toJSON();
    script.id = 'jsonld-' + Math.random().toString(36).slice(2, 9);
    document.head.appendChild(script);
    return script;
  }

  static remove(id?: string): void {
    if (id) {
      document.head.querySelector(`#${id}`)?.remove();
    } else {
      document.head.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
    }
  }
}

export function createJsonLd(type: JsonLdType, context?: string): JsonLdBuilder {
  return new JsonLdBuilder(type, context);
}
