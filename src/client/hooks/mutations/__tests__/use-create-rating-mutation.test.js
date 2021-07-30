import createRatingMutation from '@/graphql/mutations/create-rating-mutation';
import useLazyGraphQLRequest from '@/hooks/graphql/use-lazy-graphql-request';
import useCreateRatingMutation from '../use-create-rating-mutation';

jest.mock('@/hooks/graphql/use-lazy-graphql-request');

describe('useCreateRatingMutation', () => {
  let topicId;
  let resourceId;
  let ratingValue;

  beforeEach(() => {
    topicId = '123';
    resourceId = '456';
    ratingValue = 5;
  });

  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for create rating mutation', () => {
    const expected = true;
    useLazyGraphQLRequest.mockReturnValue({
      isLoading: expected,
    });

    const { isLoading: actual } = useCreateRatingMutation();

    expect(actual).toBe(expected);
    expect(useLazyGraphQLRequest).toBeCalledWith(createRatingMutation);
  });

  it('should execute create rating mutation on execute', async () => {
    const mockExecute = jest.fn();
    useLazyGraphQLRequest.mockReturnValue({
      execute: mockExecute,
    });

    const { execute } = useCreateRatingMutation();
    await execute(topicId, resourceId, ratingValue);

    expect(mockExecute).toBeCalledWith({
      topicId,
      resourceId,
      value: ratingValue,
    });
  });
});
