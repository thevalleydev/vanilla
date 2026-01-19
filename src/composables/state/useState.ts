import { ref } from '@vue/reactivity';
import type { Ref } from '@vue/reactivity';

interface UseStateReturn<T> {
  state: Ref<T>;
  setState: (value: T | ((prev: T) => T)) => void;
  reset: () => void;
}

export function useState<T>(initialValue: T): UseStateReturn<T> {
  const state = ref(initialValue) as Ref<T>;
  const initial = initialValue;

  const setState = (value: T | ((prev: T) => T)) => {
    if (typeof value === 'function') {
      state.value = (value as (prev: T) => T)(state.value);
    } else {
      state.value = value;
    }
  };

  const reset = () => {
    state.value = initial;
  };

  return { state, setState, reset };
}
