import useAvailableTopicResourcesQuery from '../queries/use-available-topic-resources-query';
import usePaginatedSearch from '../use-paginated-search';

export default function useAvailableTopicResourceSearch(
  topicId,
  { initialSearchVariables } = {}
) {
  const { execute: executeTopicResourceSearchQuery, ...others } =
    useAvailableTopicResourcesQuery();

  const executeSearch = (searchVariables) =>
    executeTopicResourceSearchQuery({ topicId, ...searchVariables });

  const search = usePaginatedSearch(executeSearch, { initialSearchVariables });

  return {
    ...search,
    ...others,
  };
}
