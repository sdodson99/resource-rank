import useTopicResourceSearchQuery from '../queries/use-topic-resource-search-query';
import useSearch from '../use-search';

export default function useTopicResourceSearch(topicId) {
  const { execute: executeTopicResourceSearchQuery, ...others } =
    useTopicResourceSearchQuery(topicId);

  const search = useSearch(executeTopicResourceSearchQuery);

  return {
    ...search,
    ...others,
  };
}
