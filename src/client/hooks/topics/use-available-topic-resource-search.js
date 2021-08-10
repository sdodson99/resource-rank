import useAvailableTopicResourcesQuery from '../queries/use-available-topic-resources-query';
import useSearch from '../use-search';

export default function useAvailableTopicResourceSearch(topicId) {
  const { execute: executeTopicResourceSearchQuery, ...others } =
    useAvailableTopicResourcesQuery();

  const executeSearch = (search) =>
    executeTopicResourceSearchQuery({ topicId, search });

  const search = useSearch(executeSearch);

  return {
    ...search,
    ...others,
  };
}
