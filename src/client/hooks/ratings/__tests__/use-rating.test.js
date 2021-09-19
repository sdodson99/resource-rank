import { renderHook } from '@testing-library/react-hooks';
import useTopicResourceUserRatingQuery from '../../queries/use-topic-resource-user-rating-query';
import useRating from '../use-rating';

jest.mock('../../queries/use-topic-resource-user-rating-query');

describe('useRating', () => {
  let mockUserRatingQuery;

  let topicId;
  let resourceId;
  let isLoggedIn;

  beforeEach(() => {
    mockUserRatingQuery = {
      execute: jest.fn(),
      data: null,
      error: null,
      isLoading: false,
      isInitialized: false,
    };
    useTopicResourceUserRatingQuery.mockReturnValue(mockUserRatingQuery);

    topicId = '123';
    resourceId = '456';
    isLoggedIn = true;
  });

  afterEach(() => {
    useTopicResourceUserRatingQuery.mockReset();
  });

  it('should return rating when user logged in', () => {
    const userRating = { value: 5 };
    useTopicResourceUserRatingQuery.mockReturnValue({
      ...mockUserRatingQuery,
      data: {
        userRating,
      },
    });

    const { result } = renderHook(() =>
      useRating(topicId, resourceId, isLoggedIn)
    );

    expect(result.current.rating).toBe(userRating);
  });

  it('should return null rating when user not logged in', () => {
    isLoggedIn = false;

    const { result } = renderHook(() =>
      useRating(topicId, resourceId, isLoggedIn)
    );

    expect(result.current.rating).toBeUndefined();
  });

  it('should clear rating when user logs out', () => {
    useTopicResourceUserRatingQuery.mockReturnValue({
      ...mockUserRatingQuery,
      data: {
        userRating: { value: 5 },
      },
    });
    const hook = renderHook(() => useRating(topicId, resourceId, isLoggedIn));
    expect(hook.result.current.rating).not.toBeUndefined();

    isLoggedIn = false;
    hook.rerender(topicId, resourceId, isLoggedIn);

    expect(hook.result.current.rating).toBeNull();
  });

  describe('isLoading', () => {
    it('should return true if query loading', () => {
      useTopicResourceUserRatingQuery.mockReturnValue({
        ...mockUserRatingQuery,
        isLoading: true,
      });

      const { result } = renderHook(() =>
        useRating(topicId, resourceId, isLoggedIn)
      );

      expect(result.current.isLoading).toBeTruthy();
    });

    it('should return true if query not initalized', () => {
      useTopicResourceUserRatingQuery.mockReturnValue({
        ...mockUserRatingQuery,
        isLoading: false,
        isInitialized: false,
      });

      const { result } = renderHook(() =>
        useRating(topicId, resourceId, isLoggedIn)
      );

      expect(result.current.isLoading).toBeTruthy();
    });
  });

  it('should return query error', () => {
    const error = new Error();
    useTopicResourceUserRatingQuery.mockReturnValue({
      ...mockUserRatingQuery,
      error,
    });

    const { result } = renderHook(() =>
      useRating(topicId, resourceId, isLoggedIn)
    );

    expect(result.current.error).toBe(error);
  });
});
