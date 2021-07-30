import updateRatingMutation from '@/graphql/mutations/update-rating-mutation';
import useLazyGraphQLRequest from '@/hooks/graphql/use-lazy-graphql-request';
import useUpdateRatingMutation from '../use-update-rating-mutation';

jest.mock('@/hooks/graphql/use-lazy-graphql-request');

describe('useUpdateRatingMutation', () => {
  let ratingId;
  let ratingValue;

  beforeEach(() => {
    ratingId = '123';
    ratingValue = 5;
  });

  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for update rating mutation', () => {
    const expected = true;
    useLazyGraphQLRequest.mockReturnValue({
      isLoading: expected,
    });

    const { isLoading: actual } = useUpdateRatingMutation();

    expect(actual).toBe(expected);
    expect(useLazyGraphQLRequest).toBeCalledWith(updateRatingMutation);
  });

  it('should execute update rating mutation on execute', async () => {
    const mockExecute = jest.fn();
    useLazyGraphQLRequest.mockReturnValue({
      execute: mockExecute,
    });

    const { execute } = useUpdateRatingMutation();
    await execute(ratingId, ratingValue);

    expect(mockExecute).toBeCalledWith({ ratingId, value: ratingValue });
  });
});
