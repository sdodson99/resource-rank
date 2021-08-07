import { when } from 'jest-when';
import useUpdateRatingMutation from '../../mutations/use-update-rating-mutation';
import useRatingUpdater from '../use-rating-updater';

jest.mock('../../mutations/use-update-rating-mutation');

describe('useRatingUpdater', () => {
  let mockExecute;

  let ratingId;
  let ratingValue;

  beforeEach(() => {
    mockExecute = jest.fn();

    ratingId = '123';
    ratingValue = 5;
  });

  afterEach(() => {
    useUpdateRatingMutation.mockReset();
  });

  it('should return isUpdatingRating status', () => {
    useUpdateRatingMutation.mockReturnValue({ isLoading: true });

    const { isUpdatingRating } = useRatingUpdater();

    expect(isUpdatingRating).toBeTruthy();
  });

  describe('updateRating', () => {
    it('should throw if update rating fails', async () => {
      useUpdateRatingMutation.mockReturnValue({ execute: mockExecute });
      when(mockExecute).calledWith(ratingId, ratingValue).mockReturnValue({
        data: null,
      });

      const { updateRating } = useRatingUpdater();

      await expect(async () => {
        await updateRating({ ratingId, ratingValue });
      }).rejects.toThrow();
    });

    it('should not throw if update rating succeeds', async () => {
      useUpdateRatingMutation.mockReturnValue({ execute: mockExecute });
      when(mockExecute)
        .calledWith(ratingId, ratingValue)
        .mockReturnValue({
          data: {
            updateRating: {},
          },
        });

      const { updateRating } = useRatingUpdater();

      await expect(async () => {
        await updateRating({ ratingId, ratingValue });
      }).resolves;
    });
  });
});
