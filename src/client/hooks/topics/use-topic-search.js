import { useEffect, useState } from 'react';
import useTopicSearchQuery from '../queries/use-topic-search-query';
import useDebounce from '../use-debounce';

export default function useTopicSearch({ initialSearch } = {}) {
  const [search, setSearch] = useState(initialSearch || '');
  const [currentSearch, setCurrentSearch] = useState('');

  const { execute: executeTopicSearchQuery, ...others } = useTopicSearchQuery();

  const executeTopicSearch = async (search) => {
    setCurrentSearch(search);
    executeTopicSearchQuery(search);
  };

  useEffect(() => {
    executeTopicSearch(search);
  }, []);

  const debounceExecuteTopicSearch = useDebounce(executeTopicSearch, 1000);

  const processSearch = (searchInput) => {
    setSearch(searchInput);
    debounceExecuteTopicSearch(searchInput);
  };

  return {
    search,
    currentSearch,
    processSearch,
    ...others,
  };
}
