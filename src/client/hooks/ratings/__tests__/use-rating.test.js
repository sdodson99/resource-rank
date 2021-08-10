import { useEffect, useState } from 'react';
import useTopicResourceUserRatingQuery from '../../queries/use-topic-resource-user-rating-query';
import useRating from '../use-rating';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
jest.mock('../../queries/use-topic-resource-user-rating-query');

describe('useRating', () => {
  let mockExecuteRatingQuery;
  let mockSetRating;

  let topicId;
  let resourceId;

  beforeEach(() => {
    mockExecuteRatingQuery = jest.fn();
    useTopicResourceUserRatingQuery.mockReturnValue({
      execute: mockExecuteRatingQuery,
      data: null,
      error: null,
      isLoading: false,
    });

    mockSetRating = jest.fn();
    useState.mockReturnValueOnce([null, mockSetRating]);

    topicId = '123';
    resourceId = '456';
  });

  afterEach(() => {
    useEffect.mockReset();
    useState.mockReset();
    useTopicResourceUserRatingQuery.mockReset();
  });

  describe('return value', () => {
    it('should return rating state', () => {
      const expected = { id: '789' };
      useState.mockReset();
      useState.mockReturnValueOnce([expected, mockSetRating]);

      const { rating } = useRating(topicId, resourceId, true);

      expect(rating).toBe(expected);
    });

    it('should return query result state', () => {
      const expectedError = new Error();
      const expectedIsLoading = true;
      useTopicResourceUserRatingQuery.mockReturnValue({
        execute: mockExecuteRatingQuery,
        data: null,
        error: expectedError,
        isLoading: expectedIsLoading,
      });

      const { error, isLoading } = useRating(topicId, resourceId, true);

      expect(error).toBe(expectedError);
      expect(isLoading).toBe(expectedIsLoading);
    });
  });

  describe('on isLoggedIn changed', () => {
    it('should query rating if logged in', async () => {
      useRating(topicId, resourceId, true);

      await useEffect.mock.calls[0][0]();

      expect(mockExecuteRatingQuery).toBeCalled();
    });

    it('should clear rating if not logged in', async () => {
      useRating(topicId, resourceId, false);

      await useEffect.mock.calls[0][0]();

      expect(mockSetRating).toBeCalledWith(null);
    });
  });

  describe('on ratingData changed', () => {
    it('should set rating', () => {
      const expected = {
        id: '789',
      };
      useTopicResourceUserRatingQuery.mockReturnValue({
        execute: mockExecuteRatingQuery,
        data: {
          userRating: expected,
        },
        error: null,
        isLoading: false,
      });
      useRating(topicId, resourceId, true);

      useEffect.mock.calls[1][0]();

      expect(mockSetRating).toBeCalledWith(expected);
    });
  });
});
