import createResourceMutation from '@/graphql/mutations/create-resource-mutation';
import useLazyGraphQLRequest from '@/hooks/graphql/use-lazy-graphql-request';
import useCreateResourceMutation from '../use-create-resource-mutation';

jest.mock('@/hooks/graphql/use-lazy-graphql-request');

describe('useCreateResourceMutation', () => {
  let name;
  let link;

  beforeEach(() => {
    name = 'name';
    link = 'link';
  });

  afterEach(() => {
    useLazyGraphQLRequest.mockReset();
  });

  it('should return lazy GraphQL request for create resource mutation', () => {
    const expected = true;
    useLazyGraphQLRequest.mockReturnValue({
      isLoading: expected,
    });

    const { isLoading: actual } = useCreateResourceMutation();

    expect(actual).toBe(expected);
    expect(useLazyGraphQLRequest).toBeCalledWith(createResourceMutation);
  });

  it('should execute create resource mutation on execute', async () => {
    const mockExecute = jest.fn();
    useLazyGraphQLRequest.mockReturnValue({
      execute: mockExecute,
    });

    const { execute } = useCreateResourceMutation();
    await execute(name, link);

    expect(mockExecute).toBeCalledWith({ name, link });
  });
});
