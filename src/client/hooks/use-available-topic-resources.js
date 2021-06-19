import getAvailableResourcesQuery from '../gql-requests/get-available-resources-query';
import useLiveSearch from './use-live-search';

export default function useAvailableTopicResources(topicId) {
  const getAvailableTopicResources = async (searchInput) => {
    const { data, error } = await client.query({
      query: getAvailableResourcesQuery,
      variables: {
        topicId,
        search: searchInput,
        limit: 20,
      },
    });

    if (error) {
      throw error;
    }

    const availableResources = data?.availableResources;
    if (!availableResources) {
      throw new Error('Failed to load available resources.');
    }

    return availableResources;
  };

  const {
    data: availableTopicResources,
    dataLoading: isLoading,
    dataLoadError: error,
    search,
    currentSearch,
    processSearch: processSearchInput,
  } = useLiveSearch(getAvailableTopicResources);

  return {
    availableTopicResources,
    isLoading,
    error,
    search,
    currentSearch,
    processSearchInput,
  };
}
