import useTopicResourceSearchQuery from '../queries/use-topic-resource-search-query';
import usePaginatedSearch from '../use-paginated-search';

export default function useTopicResourceSearch(
  topicId,
  { initialSearchVariables } = {}
) {
  const { execute, ...others } = useTopicResourceSearchQuery();

  const executeTopicResourceSearchQuery = (searchVariables) => {
    execute({
      ...searchVariables,
      topicId,
    });
  };

  const search = usePaginatedSearch(executeTopicResourceSearchQuery, {
    initialSearchVariables,
  });

  return {
    ...search,
    ...others,
  };
}
