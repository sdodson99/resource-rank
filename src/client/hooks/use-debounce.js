import { useCallback } from 'react';
import debounce from 'lodash.debounce';

export default function useDebounce(callback, wait) {
  const debouncedFunction = debounce(callback, wait);

  return useCallback(debouncedFunction, []);
}
