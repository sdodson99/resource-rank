import useGraphQLQuery from '@/hooks/graphql/use-graphql-query';
import readOnlyModeEnabledQuery from '@/graphql/queries/read-only-mode-enabled-query';
import useReadOnlyModeEnabledQuery from '../use-read-only-mode-enabled-query';

jest.mock('@/hooks/graphql/use-graphql-query');

describe('useReadOnlyModeEnabledQuery', () => {
  afterEach(() => {
    useGraphQLQuery.mockReset();
  });

  it('should return GraphQL query for read only mode', () => {
    const expected = true;
    useGraphQLQuery.mockReturnValue({
      data: {
        readOnlyModeEnabled: expected,
      },
    });

    const actual = useReadOnlyModeEnabledQuery();

    expect(actual).toBe(expected);
    expect(useGraphQLQuery).toBeCalledWith(readOnlyModeEnabledQuery);
  });
});
