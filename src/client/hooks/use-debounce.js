import { useCallback } from 'react';
import debounce from 'lodash.debounce';

export default function useDebounce(callback, wait) {
  return useCallback(
    debounce((args) => callback(args), wait),
    []
  );
}
