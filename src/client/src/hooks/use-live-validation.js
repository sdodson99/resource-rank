import { useState, useEffect } from 'react';
import useLiveSearch from './use-live-search';

export default function useLiveValidation(executeValidation) {
  const [isValid, setIsValid] = useState(true);

  const {
    data: isValidResponse,
    processSearch: validate,
    dataLoading,
    currentSearch,
  } = useLiveSearch(executeValidation, true);

  useEffect(() => setIsValid(isValidResponse), [isValidResponse]);

  const validateInput = (input) => {
    setIsValid(true);
    validate(input);
  };

  const isValidating = dataLoading && !!currentSearch;

  return {
    isValid,
    setIsValid,
    isValidating,
    validateInput,
  };
}
