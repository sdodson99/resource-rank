import { useEffect, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

function useLiveValidation(validateCallback) {
  const valueSubject = useRef(new Subject()).current;
  const [isValid, setIsValid] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const validate = async (incomingValue) => {
    setIsValidating(true);

    try {
      return await validateCallback(incomingValue);
    } catch {
      return true;
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    const subscription = valueSubject
      .pipe(debounceTime(1000), switchMap(validate))
      .subscribe((validationResult) => {
        setIsValid(validationResult);
      });

    return () => subscription.unsubscribe();
  }, []);

  const validateValue = (value) => valueSubject.next(value);

  return {
    isValid,
    isValidating,
    validateValue,
    setIsValid,
  };
}

export default useLiveValidation;
