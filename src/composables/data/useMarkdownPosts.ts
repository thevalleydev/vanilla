import { ref, computed } from '@vue/reactivity';
import type { Ref, ComputedRef } from '@vue/reactivity';
import { marked } from 'marked';
import type { MarkdownPost } from '../../types';

// Simple YAML parser for frontmatter
function parseFrontmatter(content: string): { data: Record<string, any>; content: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!match) {
    return { data: {}, content };
  }

  const [, yamlStr, markdown] = match;
  const data: Record<string, any> = {};

  yamlStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value: string | string[] = valueParts.join(':').trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays (simple comma-separated)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim());
      }
      
      data[key.trim()] = value;
    }
  });

  return { data, content: markdown };
}

interface UseMarkdownPostsReturn {
  posts: Ref<MarkdownPost[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  getPostBySlug: (slug: string) => MarkdownPost | undefined;
  postsByTag: ComputedRef<Record<string, MarkdownPost[]>>;
  sortedPosts: ComputedRef<MarkdownPost[]>;
  loadPosts: () => Promise<void>;
}

let postsInstance: UseMarkdownPostsReturn | null = null;

export function useMarkdownPosts(): UseMarkdownPostsReturn {
  if (postsInstance) {
    return postsInstance;
  }

  const posts = ref<MarkdownPost[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const sortedPosts = computed(() => {
    return [...posts.value].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  const postsByTag = computed(() => {
    const byTag: Record<string, MarkdownPost[]> = {};
      posts.value.forEach((post: MarkdownPost) => {
        post.tags?.forEach((tag: string) => {
        if (!byTag[tag]) byTag[tag] = [];
        byTag[tag].push(post);
      });
    });
    return byTag;
  });

  function getPostBySlug(slug: string) {
    return posts.value.find((post: MarkdownPost) => post.slug === slug);
  }

  async function loadPosts() {
    loading.value = true;
    error.value = null;

    try {
      const modules = import.meta.glob<{ default: string }>(
        '../../content/posts/*.md',
        { query: '?raw', import: 'default', eager: false }
      );

      const loadedPosts: MarkdownPost[] = [];

      for (const [path, loader] of Object.entries(modules)) {
        const contentModule = await loader() as any;
        const content = typeof contentModule === 'string' ? contentModule : contentModule.default;
        const slug = path.split('/').pop()?.replace('.md', '') || '';

        const { data: frontmatter, content: markdown } = parseFrontmatter(content);

        const htmlContent = await marked(markdown);

        loadedPosts.push({
          slug,
          title: (frontmatter.title as string) || slug,
          date: (frontmatter.date as string) || new Date().toISOString(),
          content: htmlContent,
          excerpt: (frontmatter.excerpt as string) || undefined,
          tags: (frontmatter.tags as string)
            ? (frontmatter.tags as string).split(',').map((t) => t.trim())
            : [],
        });
      }

      posts.value = loadedPosts;
    } catch (e) {
      error.value = e as Error;
      console.error('Failed to load posts:', e);
    } finally {
      loading.value = false;
    }
  }

  postsInstance = {
    posts,
    loading,
    error,
    getPostBySlug,
    postsByTag,
    sortedPosts,
    loadPosts,
  };

  return postsInstance;
}
