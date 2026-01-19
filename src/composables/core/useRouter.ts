import { ref } from '@vue/reactivity';
import type { Ref } from '@vue/reactivity';
import type { Route } from '../../types';

interface UseRouterReturn {
  currentRoute: Ref<Route>;
  navigate: (path: string) => void;
  back: () => void;
  forward: () => void;
}

let routerInstance: UseRouterReturn | null = null;

function parseRoute(pathname: string): Route {
  const [pathPart, queryPart] = pathname.split('?');
  
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
    window.history.pushState({}, '', path);
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
