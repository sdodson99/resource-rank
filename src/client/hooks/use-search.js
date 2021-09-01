import { useEffect, useState } from 'react';
import useDebounce from './use-debounce';

export default function useSearch(
  executeSearchQuery,
  { initialSearchVariables } = {}
) {
  const [searchVariables, setSearchVariables] = useState(
    initialSearchVariables || {}
  );
  const [currentSearchVariables, setCurrentSearchVariables] = useState({});

  const executeSearch = async (searchVariables) => {
    setCurrentSearchVariables(searchVariables);
    executeSearchQuery(searchVariables);
  };

  useEffect(() => {
    executeSearch(searchVariables);
  }, []);

  const debounceExecuteSearch = useDebounce(executeSearch, 1000);

  const debounceProcessSearch = (searchVariables) => {
    setSearchVariables(searchVariables);
    debounceExecuteSearch(searchVariables);
  };

  const processSearch = (searchVariables) => {
    setSearchVariables(searchVariables);
    executeSearch(searchVariables);
  };

  return {
    searchVariables,
    currentSearchVariables,
    debounceProcessSearch,
    processSearch,
  };
}
