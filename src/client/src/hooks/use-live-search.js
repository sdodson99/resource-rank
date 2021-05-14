import { useEffect, useRef, useState } from 'react';
import { merge, of, Subject } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

export default function useLiveSearch(executeSearch, defaultValue = null) {
  const [data, setData] = useState(defaultValue);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataLoadError, setDataLoadError] = useState();
  const [currentSearch, setCurrentSearch] = useState('');
  const [search, setSearch] = useState('');
  const searchSubject = useRef(new Subject()).current;

  useEffect(() => {
    const subscription = searchSubject
      .pipe(
        debounceTime(1000),
        switchMap((searchInput) =>
          merge(
            of({ loading: true, input: searchInput }),
            of(searchInput).pipe(
              switchMap(executeSearch),
              map((data) => ({ data, input: searchInput })),
              catchError((error) => of({ error }))
            )
          )
        )
      )
      .subscribe(({ data, loading, error, input }) => {
        setDataLoadError(null);
        setDataLoading(false);

        if (loading) {
          return setDataLoading(true);
        }

        if (error) {
          return setDataLoadError(error);
        }

        setData(data);
        setCurrentSearch(input);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(async () => {
    setDataLoading(true);
    setDataLoadError(null);

    try {
      const data = await executeSearch(search);
      setData(data);
    } catch (error) {
      setDataLoadError(error);
    }

    setDataLoading(false);
  }, []);

  const processSearch = (searchInput) => {
    setSearch(searchInput);
    searchSubject.next(searchInput);
  };

  return {
    data,
    dataLoading,
    dataLoadError,
    search,
    currentSearch,
    processSearch,
  };
}
