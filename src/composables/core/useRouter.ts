import { ref } from '@vue/reactivity';
import type { Ref } from '@vue/reactivity';
import type { Route } from '../../types';

// Get base path from Vite config (injected at build time)
const BASE_PATH = import.meta.env.BASE_URL || '/';

interface UseRouterReturn {
  currentRoute: Ref<Route>;
  navigate: (path: string) => void;
  back: () => void;
  forward: () => void;
}

let routerInstance: UseRouterReturn | null = null;

function parseRoute(pathname: string): Route {
  // Strip base path from pathname
  let path = pathname;
  if (BASE_PATH !== '/' && pathname.startsWith(BASE_PATH)) {
    path = pathname.slice(BASE_PATH.length - 1); // Keep leading slash
  }
  
  const [pathPart, queryPart] = path.split('?');
  
  const query: Record<string, string> = {};
  if (queryPart) {
    queryPart.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      query[key] = decodeURIComponent(value || '');
    });
  }

  return {
    path: pathPart || '/',
    params: {},
    query
  };
}

export function useRouter(): UseRouterReturn {
  if (routerInstance) {
    return routerInstance;
  }

  const currentRoute = ref<Route>(parseRoute(window.location.pathname));

  function navigate(path: string) {
    // Add base path when navigating
    const fullPath = BASE_PATH === '/' ? path : BASE_PATH + path.replace(/^\//, '');
    window.history.pushState({}, '', fullPath);
    currentRoute.value = parseRoute(window.location.pathname);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function back() {
    window.history.back();
  }

  function forward() {
    window.history.forward();
  }

  // Listen for browser back/forward buttons
  window.addEventListener('popstate', () => {
    currentRoute.value = parseRoute(window.location.pathname);
  });

  routerInstance = {
    currentRoute,
    navigate,
    back,
    forward,
  };

  return routerInstance;
}
