import useSearch from './use-search';

export default function usePaginatedSearch(
  executeSearchQuery,
  { initialSearchVariables } = {}
) {
  const {
    searchVariables,
    currentSearchVariables,
    debounceProcessSearch,
    processSearch,
  } = useSearch(executeSearchQuery, { initialSearchVariables });

  const getCurrentPage = () => {
    const { offset, limit } = currentSearchVariables;

    if (limit === 0) {
      return 1;
    }

    return Math.floor(offset / limit) + 1;
  };

  const processPageNumber = (pageNumber) => {
    const { limit } = currentSearchVariables;
    const offset = (pageNumber - 1) * limit;

    processSearch({
      ...currentSearchVariables,
      offset,
    });
  };

  const currentPage = getCurrentPage();

  return {
    searchVariables,
    currentSearchVariables,
    debounceProcessSearch,
    currentPage,
    processPageNumber,
  };
}
