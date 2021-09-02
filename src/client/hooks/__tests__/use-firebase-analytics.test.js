import useFirebaseAnalytics from '../use-firebase-analytics';
import useFirebaseAppContext from '../use-firebase-app-context';

jest.mock('../use-firebase-app-context');

describe('useFirebaseAnalytics', () => {
  let mockFirebase;

  beforeEach(() => {
    mockFirebase = {
      analytics: jest.fn(),
    };

    useFirebaseAppContext.mockReturnValue(mockFirebase);
  });

  afterEach(() => {
    useFirebaseAppContext.mockReset();
  });

  it('should return Firebase analytics', () => {
    const mockAnalytics = {};
    mockFirebase.analytics.mockReturnValue(mockAnalytics);

    const analytics = useFirebaseAnalytics();

    expect(analytics).toBe(mockAnalytics);
  });
});
