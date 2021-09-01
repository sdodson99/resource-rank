import useTopicSearchQuery from '../queries/use-topic-search-query';
import usePaginatedSearch from '../use-paginated-search';

export default function useTopicSearch({ initialSearchVariables } = {}) {
  const { execute: executeTopicSearchQuery, ...others } = useTopicSearchQuery();

  const search = usePaginatedSearch(executeTopicSearchQuery, {
    initialSearchVariables,
  });

  return {
    ...search,
    ...others,
  };
}
