import { useQuery } from '@apollo/client';
import readOnlyModeEnabledQuery from '../gql-requests/read-only-mode-enabled-query';

export default function useReadOnlyModeStatus() {
  const { data, error, ...others } = useQuery(readOnlyModeEnabledQuery, {
    fetchPolicy: 'cache-first',
  });

  const readOnlyModeEnabled = data?.readOnlyModeEnabled;

  return readOnlyModeEnabled;
}
