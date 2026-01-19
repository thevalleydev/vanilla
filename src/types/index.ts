
export interface Route {
  path: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

export interface MarkdownPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt?: string;
  tags?: string[];
}
