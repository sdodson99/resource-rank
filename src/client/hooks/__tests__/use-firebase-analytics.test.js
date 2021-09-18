import useFirebaseAnalytics from '../use-firebase-analytics';
import { useEffect, useState } from 'react';
import useFirebaseAppContext from '../use-firebase-app-context';
import configuration from '@/configuration/index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
jest.mock('../use-firebase-app-context');

describe('useFirebaseAnalytics', () => {
  let mockAnalytics;
  let originalConsoleLog;

  beforeEach(() => {
    const mockFirebase = {
      analytics: jest.fn(),
    };
    mockFirebase.analytics.mockReturnValue(mockAnalytics);
    useFirebaseAppContext.mockReturnValue(mockFirebase);

    useState.mockReturnValue([null, jest.fn()]);
    useEffect.mockImplementation((cb) => cb());

    configuration.ENVIRONMENT = 'development';

    originalConsoleLog = console.log;
    console.log = jest.fn();
  });

  afterEach(() => {
    useFirebaseAppContext.mockReset();
    useState.mockReset();
    useEffect.mockReset();
    console.log = originalConsoleLog;
  });

  it('should return analytics state', () => {
    useState.mockReturnValue([mockAnalytics, jest.fn()]);

    const analytics = useFirebaseAnalytics();

    expect(analytics).toBe(mockAnalytics);
  });

  it('should initialize Firebase analytics on mount when running in production', () => {
    configuration.ENVIRONMENT = 'production';
    const mockSetAnalytics = jest.fn();
    useState.mockReturnValue([null, mockSetAnalytics]);

    useFirebaseAnalytics();

    expect(mockSetAnalytics).toBeCalledWith(mockAnalytics);
  });

  it('should not initialize Firebase analytics on mount when not running in production', () => {
    const mockSetAnalytics = jest.fn();
    useState.mockReturnValue([null, mockSetAnalytics]);

    useFirebaseAnalytics();

    expect(mockSetAnalytics).not.toBeCalled();
  });
});
