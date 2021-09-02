import useFirebaseAnalytics from '../use-firebase-analytics';
import { useEffect, useState } from 'react';
import useFirebaseAppContext from '../use-firebase-app-context';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
jest.mock('../use-firebase-app-context');

describe('useFirebaseAnalytics', () => {
  let mockAnalytics;

  beforeEach(() => {
    const mockFirebase = {
      analytics: jest.fn(),
    };
    mockFirebase.analytics.mockReturnValue(mockAnalytics);
    useFirebaseAppContext.mockReturnValue(mockFirebase);

    useState.mockReturnValue([null, jest.fn()]);
    useEffect.mockImplementation((cb) => cb());
  });

  afterEach(() => {
    useFirebaseAppContext.mockReset();
    useState.mockReset();
    useEffect.mockReset();
  });

  it('should return initialized analytics', () => {
    useState.mockReturnValue([mockAnalytics, jest.fn()]);

    const analytics = useFirebaseAnalytics();

    expect(analytics).toBe(mockAnalytics);
  });

  it('should initialize Firebase analytics on mount', () => {
    const mockSetAnalytics = jest.fn();
    useState.mockReturnValue([null, mockSetAnalytics]);

    useFirebaseAnalytics();

    expect(mockSetAnalytics).toBeCalledWith(mockAnalytics);
  });
});
