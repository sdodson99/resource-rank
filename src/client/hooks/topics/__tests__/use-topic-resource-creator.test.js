import { when } from 'jest-when';
import useCreateTopicResourceMutation from '../../mutations/use-create-topic-resource-mutation';
import useTopicResourceCreator from '../use-topic-resource-creator';

jest.mock('../../mutations/use-create-topic-resource-mutation');

describe('useTopicResourceCreator', () => {
  let mockExecute;
  let mockIsLoading;

  beforeEach(() => {
    mockExecute = jest.fn();
    mockIsLoading = true;

    useCreateTopicResourceMutation.mockReturnValue({
      execute: mockExecute,
      isLoading: mockIsLoading,
    });
  });

  afterEach(() => {
    useCreateTopicResourceMutation.mockReset();
  });

  describe('createTopicResource', () => {
    let topicId;
    let resourceId;

    beforeEach(() => {
      topicId = '123';
      resourceId = '456';
    });

    it('should return true if successful', async () => {
      when(mockExecute)
        .calledWith(topicId, resourceId)
        .mockReturnValue({
          data: {
            createTopicResource: true,
          },
        });
      const { createTopicResource } = useTopicResourceCreator();

      const result = await createTopicResource(topicId, resourceId);

      expect(result).toBeTruthy();
    });
    it('should return false if error', async () => {
      when(mockExecute)
        .calledWith(topicId, resourceId)
        .mockReturnValue({ error: new Error() });
      const { createTopicResource } = useTopicResourceCreator();

      const result = await createTopicResource(topicId, resourceId);

      expect(result).toBeFalsy();
    });
  });

  it('should return isCreating state', () => {
    const { isCreating } = useTopicResourceCreator();

    expect(isCreating).toBe(mockIsLoading);
  });
});
