import constate from 'constate';
import useFeatureFlagsQuery from './queries/use-feature-flags-query';

function useFeatureFlags() {
  const { data, error, loading } = useFeatureFlagsQuery();

  const featureFlags = data?.featureFlags ?? [];

  const isEnabled = (name) => {
    if (loading || error) {
      return false;
    }

    const featureFlag = featureFlags.find((f) => f.name === name);

    if (!featureFlag) {
      return false;
    }

    return featureFlag.isEnabled === 'true';
  };

  return {
    isEnabled,
    loading,
    error,
  };
}

const [FeatureFlagsProvider, useFeatureFlagsContext] =
  constate(useFeatureFlags);

export { FeatureFlagsProvider };
export default useFeatureFlagsContext;
