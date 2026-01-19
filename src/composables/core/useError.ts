import { ref } from '@vue/reactivity';
import type { Ref } from '@vue/reactivity';

interface UseErrorReturn {
  error: Ref<Error | null>;
  setError: (err: Error | null) => void;
  clearError: () => void;
}

export function useError(): UseErrorReturn {
  const error = ref<Error | null>(null);

  const setError = (err: Error | null) => {
    error.value = err;
    if (err) {
      console.error('[App Error]', err);
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    error,
    setError,
    clearError,
  };
}
