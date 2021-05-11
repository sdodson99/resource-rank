import { useState, useEffect } from 'react';
import useLiveSearch from './use-live-search';

export default function useLiveValidation(executeValidation) {
  const [isValid, setIsValid] = useState(true);

  const {
    data: isValidResponse,
    processSearch: validate,
    dataLoading: isValidating,
  } = useLiveSearch(executeValidation);

  useEffect(() => setIsValid(isValidResponse), [isValidResponse]);

  const validateInput = (input) => {
    setIsValid(true);
    validate(input);
  };

  return {
    isValid,
    setIsValid,
    isValidating,
    validateInput,
  };
}
