import createTopicMutation from '@/graphql/mutations/create-topic-mutation';
import useLazyGraphQLRequest from '@/hooks/graphql/use-lazy-graphql-request';
import useCreateTopicMutation from '../use-create-topic-mutation';

jest.mock('@/hooks/graphql/use-lazy-graphql-request');

describe('useCreateTopicMutation', () => {
  let name;

  beforeEach(() => {
    name = 'name';
  });

  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for create topic mutation', () => {
    const expected = true;
    useLazyGraphQLRequest.mockReturnValue({
      isLoading: expected,
    });

    const { isLoading: actual } = useCreateTopicMutation();

    expect(actual).toBe(expected);
    expect(useLazyGraphQLRequest).toBeCalledWith(createTopicMutation);
  });

  it('should execute create topic mutation on execute', async () => {
    const mockExecute = jest.fn();
    useLazyGraphQLRequest.mockReturnValue({
      execute: mockExecute,
    });

    const { execute } = useCreateTopicMutation();
    await execute({ name });

    expect(mockExecute).toBeCalledWith({ name });
  });
});
