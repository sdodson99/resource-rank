import { when } from 'jest-when';
import useCreateRatingMutation from '../../mutations/use-create-rating-mutation';
import useRatingCreator from '../use-rating-creator';

jest.mock('../../mutations/use-create-rating-mutation');

describe('useRatingCreator', () => {
  let mockExecute;

  let topicId;
  let resourceId;
  let ratingValue;

  beforeEach(() => {
    mockExecute = jest.fn();

    topicId = '123';
    resourceId = '456';
    ratingValue = 5;
  });

  afterEach(() => {
    useCreateRatingMutation.mockReset();
  });

  it('should return isCreatingRating status', () => {
    useCreateRatingMutation.mockReturnValue({ isLoading: true });

    const { isCreatingRating } = useRatingCreator();

    expect(isCreatingRating).toBeTruthy();
  });

  describe('createRating', () => {
    it('should throw if no created rating returned', async () => {
      useCreateRatingMutation.mockReturnValue({ execute: mockExecute });
      when(mockExecute)
        .calledWith(topicId, resourceId, ratingValue)
        .mockReturnValue({
          data: null,
        });

      const { createRating } = useRatingCreator();

      await expect(async () => {
        await createRating({ topicId, resourceId, ratingValue });
      }).rejects.toThrow();
    });

    it('should return created rating if successful', async () => {
      const expected = {
        id: '123',
      };
      useCreateRatingMutation.mockReturnValue({ execute: mockExecute });
      when(mockExecute)
        .calledWith(topicId, resourceId, ratingValue)
        .mockReturnValue({
          data: {
            createRating: expected,
          },
        });

      const { createRating } = useRatingCreator();
      const actual = await createRating({
        topicId,
        resourceId,
        ratingValue,
      });

      expect(actual).toBe(expected);
    });
  });
});
