import { ref, watch } from '@vue/reactivity';
import type { Ref } from '@vue/reactivity';

type Theme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Ref<Theme>;
  toggleTheme: () => void;
  setTheme: (newTheme: Theme) => void;
}

let themeInstance: UseThemeReturn | null = null;

function getInitialTheme(): Theme {
  // Check localStorage first
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useTheme(): UseThemeReturn {
  if (themeInstance) {
    return themeInstance;
  }

  const theme = ref<Theme>(getInitialTheme());

  // Apply initial theme
  applyTheme(theme.value);

  // Watch for theme changes
  watch(theme, (newTheme) => {
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      theme.value = e.matches ? 'dark' : 'light';
    }
  });

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
  }

  themeInstance = {
    theme,
    toggleTheme,
    setTheme,
  };

  return themeInstance;
}
