import useTopicSearchQuery from '../queries/use-topic-search-query';
import useSearch from '../use-search';

export default function useTopicSearch({ initialSearch } = {}) {
  const { execute: executeTopicSearchQuery, ...others } = useTopicSearchQuery();

  const search = useSearch(executeTopicSearchQuery, { initialSearch });

  return {
    ...search,
    ...others,
  };
}
