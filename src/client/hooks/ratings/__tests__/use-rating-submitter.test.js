import { when } from 'jest-when';
import useRatingCreator from '../use-rating-creator';
import useRatingSubmitter from '../use-rating-submitter';
import useRatingUpdater from '../use-rating-updater';

jest.mock('../use-rating-creator');
jest.mock('../use-rating-updater');

describe('useRatingSubmitter', () => {
  let mockCreate;
  let mockUpdate;

  let topicId;
  let resourceId;
  let ratingValue;

  beforeEach(() => {
    mockCreate = jest.fn();
    useRatingCreator.mockReturnValue({
      createRating: mockCreate,
    });

    mockUpdate = jest.fn();
    useRatingUpdater.mockReturnValue({
      updateRating: mockUpdate,
    });

    topicId = '123';
    resourceId = '456';
    ratingValue = 5;
  });

  afterEach(() => {
    useRatingCreator.mockReset();
    useRatingUpdater.mockReset();
  });

  describe('submitRating', () => {
    it('should return created rating if rating does not exist', async () => {
      const createdRating = {
        id: '789',
        value: ratingValue,
      };
      when(mockCreate)
        .calledWith({ topicId, resourceId, ratingValue })
        .mockReturnValue(createdRating);
      const { submitRating } = useRatingSubmitter(topicId, resourceId);

      const rating = await submitRating(ratingValue);

      expect(rating).toBe(createdRating);
    });

    it('should return updated rating if rating exists', async () => {
      const updatedRating = {
        id: '789',
        value: ratingValue,
      };
      const { submitRating } = useRatingSubmitter(topicId, resourceId, {
        id: '789',
      });

      const rating = await submitRating(ratingValue);

      expect(rating).toEqual(updatedRating);
      expect(mockUpdate).toBeCalledWith({
        ratingId: '789',
        ratingValue,
      });
    });
  });

  describe('isSubmittingRating', () => {
    it('should return true if is creating', () => {
      useRatingCreator.mockReturnValue({
        isCreatingRating: true,
      });

      const { isSubmittingRating } = useRatingSubmitter(topicId, resourceId);

      expect(isSubmittingRating).toBeTruthy();
    });

    it('should return true if is updating', () => {
      useRatingUpdater.mockReturnValue({
        isUpdatingRating: true,
      });

      const { isSubmittingRating } = useRatingSubmitter(topicId, resourceId);

      expect(isSubmittingRating).toBeTruthy();
    });

    it('should return false if is not creating or updating', () => {
      const { isSubmittingRating } = useRatingSubmitter(topicId, resourceId);

      expect(isSubmittingRating).toBeFalsy();
    });
  });
});
