/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { renderHook } from '@testing-library/react-hooks';
import useFeatureFlagsContext, {
  FeatureFlagsProvider,
} from '../use-feature-flags-context';
import useFeatureFlagsQuery from '../queries/use-feature-flags-query';

jest.mock('../queries/use-feature-flags-query');

describe('useFeatureFlagsContext', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = FeatureFlagsProvider;
  });

  afterEach(() => {
    useFeatureFlagsQuery.mockReset();
  });

  it('should return loading state', () => {
    const expected = true;
    useFeatureFlagsQuery.mockReturnValue({ loading: expected });

    const { result } = renderHook(() => useFeatureFlagsContext(), { wrapper });

    expect(result.current.loading).toBe(expected);
  });

  it('should return error state', () => {
    const expected = new Error();
    useFeatureFlagsQuery.mockReturnValue({ error: expected });

    const { result } = renderHook(() => useFeatureFlagsContext(), { wrapper });

    expect(result.current.error).toBe(expected);
  });

  describe('isEnabled', () => {
    let featureFlagName;

    beforeEach(() => {
      featureFlagName = 'feature-flag-name';
    });

    it('should return false if feature flags loading', () => {
      useFeatureFlagsQuery.mockReturnValue({ loading: true });

      const { result } = renderHook(() => useFeatureFlagsContext(), {
        wrapper,
      });
      const isEnabled = result.current.isEnabled(featureFlagName);

      expect(isEnabled).toBeFalsy();
    });

    it('should return false if feature flags query failed', () => {
      useFeatureFlagsQuery.mockReturnValue({
        loading: false,
        error: new Error(),
      });

      const { result } = renderHook(() => useFeatureFlagsContext(), {
        wrapper,
      });
      const isEnabled = result.current.isEnabled(featureFlagName);

      expect(isEnabled).toBeFalsy();
    });

    it('should return false if feature flag not found', () => {
      useFeatureFlagsQuery.mockReturnValue({
        data: {
          featureFlags: [
            {
              name: 'other-feature-flag',
              isEnabled: 'true',
            },
          ],
        },
      });

      const { result } = renderHook(() => useFeatureFlagsContext(), {
        wrapper,
      });
      const isEnabled = result.current.isEnabled(featureFlagName);

      expect(isEnabled).toBeFalsy();
    });

    it('should return false if feature flag disabled', () => {
      useFeatureFlagsQuery.mockReturnValue({
        data: {
          featureFlags: [
            {
              name: featureFlagName,
              isEnabled: 'false',
            },
          ],
        },
      });

      const { result } = renderHook(() => useFeatureFlagsContext(), {
        wrapper,
      });
      const isEnabled = result.current.isEnabled(featureFlagName);

      expect(isEnabled).toBeFalsy();
    });

    it('should return true if feature flag enabled', () => {
      useFeatureFlagsQuery.mockReturnValue({
        data: {
          featureFlags: [
            {
              name: featureFlagName,
              isEnabled: 'true',
            },
          ],
        },
      });

      const { result } = renderHook(() => useFeatureFlagsContext(), {
        wrapper,
      });
      const isEnabled = result.current.isEnabled(featureFlagName);

      expect(isEnabled).toBeTruthy();
    });
  });
});
