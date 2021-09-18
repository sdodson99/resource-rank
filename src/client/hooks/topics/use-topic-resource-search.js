import useTopicResourceSearchQuery from '../queries/use-topic-resource-search-query';
import usePaginatedSearch from '../use-paginated-search';

export default function useTopicResourceSearch(
  topicId,
  { initialSearchVariables } = {}
) {
  const { execute, ...others } = useTopicResourceSearchQuery();

  const executeTopicResourceSearchQuery = ({
    resourceSearch,
    offset,
    limit,
  }) => {
    execute({
      topicId,
      searchOptions: {
        search: resourceSearch,
        offset,
        limit,
      },
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
