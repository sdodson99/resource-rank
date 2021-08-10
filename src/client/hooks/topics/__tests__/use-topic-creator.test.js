import useCreateTopicMutation from '../../mutations/use-create-topic-mutation';
import getErrorCode from '@/graphql/errors/get-error-code';
import ErrorCode from '@/graphql/errors/error-code';
import TopicExistsError from '@/errors/topic-exists-error';
import { when } from 'jest-when';
import useTopicCreator from '../use-topic-creator';

jest.mock('../../mutations/use-create-topic-mutation');
jest.mock('@/graphql/errors/get-error-code');

describe('useTopicCreator', () => {
  afterEach(() => {
    useCreateTopicMutation.mockReset();
    getErrorCode.mockReset();
  });

  describe('createTopic', () => {
    let mockExecuteMutation;

    let name;
    let error;

    beforeEach(() => {
      mockExecuteMutation = jest.fn();
      useCreateTopicMutation.mockReturnValue({
        execute: mockExecuteMutation,
      });

      name = 'topic-name';
      error = new Error();
    });

    it('should throw topic already exists error if topic already exists', async () => {
      when(mockExecuteMutation).calledWith({ name }).mockReturnValue({ error });
      when(getErrorCode)
        .calledWith(error)
        .mockReturnValue(ErrorCode.TOPIC_ALREADY_EXISTS);

      const { createTopic } = useTopicCreator();

      await expect(async () => await createTopic({ name })).rejects.toThrow(
        TopicExistsError
      );
    });

    it('should throw error if request returns error', async () => {
      when(mockExecuteMutation).calledWith({ name }).mockReturnValue({ error });

      const { createTopic } = useTopicCreator();

      await expect(async () => await createTopic({ name })).rejects.toThrow();
    });

    it('should throw error if request returns no created topic', async () => {
      when(mockExecuteMutation)
        .calledWith({ name })
        .mockReturnValue({ data: null });

      const { createTopic } = useTopicCreator();

      await expect(async () => await createTopic({ name })).rejects.toThrow();
    });

    it('should return created topic if successful', async () => {
      const expected = {
        id: '123',
        name,
        slug: 'topic-name',
      };
      when(mockExecuteMutation)
        .calledWith({ name })
        .mockReturnValue({ data: { createTopic: expected } });

      const { createTopic } = useTopicCreator();
      const actual = await createTopic({ name });

      expect(actual).toBe(expected);
    });
  });
});
