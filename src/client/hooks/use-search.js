import { useEffect, useState } from 'react';
import useDebounce from './use-debounce';

export default function useSearch(executeSearchQuery, { initialSearch } = {}) {
  const [search, setSearch] = useState(initialSearch || '');
  const [currentSearch, setCurrentSearch] = useState('');

  const executeSearch = async (search) => {
    setCurrentSearch(search);
    executeSearchQuery(search);
  };

  useEffect(() => {
    executeSearch(search);
  }, []);

  const debounceExecuteSearch = useDebounce(executeSearch, 1000);

  const processSearch = (searchInput) => {
    setSearch(searchInput);
    debounceExecuteSearch(searchInput);
  };

  return {
    search,
    currentSearch,
    processSearch,
  };
}
