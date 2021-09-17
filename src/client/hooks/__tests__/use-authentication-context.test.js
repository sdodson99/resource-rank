import { useAuthentication } from '../use-authentication-context';
import { useEffect, useState } from 'react';
import useFirebaseAppContext from '../use-firebase-app-context';
import useMockContext from '../use-mock-context';
import mocks from '../../mocks';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
jest.mock('../use-firebase-app-context');
jest.mock('../use-mock-context');
jest.mock('../../mocks');

describe('useAuthentication', () => {
  let mockAuthenticationState;
  let mockSetAuthenticationState;

  beforeEach(() => {
    mockAuthenticationState = {
      isLoggedIn: false,
      currentUser: null,
      initialized: false,
    };
    mockSetAuthenticationState = jest.fn();
    useState.mockReturnValueOnce([
      mockAuthenticationState,
      mockSetAuthenticationState,
    ]);

    useState.mockReturnValue([null, jest.fn()]);
  });

  afterEach(() => {
    useEffect.mockReset();
    useState.mockReset();
    useFirebaseAppContext.mockReset();
    useMockContext.mockReset();
  });

  it('should return authentication state', () => {
    const expected = mockAuthenticationState;
    useState.mockReturnValue([expected]);

    const actual = useAuthentication();

    expect(actual).toBe(expected);
  });

  it('should update authentication state on Firebase authentication state change', () => {
    const expected = {
      isLoggedIn: true,
      currentUser: {
        username: 'test',
      },
      initialized: true,
    };
    useEffect.mockImplementationOnce((callback) => callback());
    useFirebaseAppContext.mockReturnValue({
      auth: () => ({
        onAuthStateChanged: (callback) => callback({ username: 'test' }),
      }),
    });

    useAuthentication();

    expect(mockSetAuthenticationState).toBeCalledWith(expected);
  });

  it('should unsubscribe from Firebase authentication state change on unmount', () => {
    const mockUnsubscribe = jest.fn();
    useFirebaseAppContext.mockReturnValue({
      auth: () => ({
        onAuthStateChanged: () => mockUnsubscribe,
      }),
    });
    useEffect.mockImplementationOnce((callback) => callback()());

    useAuthentication();

    expect(mockUnsubscribe).toBeCalled();
  });

  describe('with mocks', () => {
    it('should use mock auth state if mock provided', () => {
      const expected = { isLoggedIn: true, initialized: true };
      mocks.test = { authState: { isLoggedIn: true } };
      useMockContext.mockReturnValue('test');
      useEffect.mockImplementationOnce((callback) => callback());

      useAuthentication();

      expect(mockSetAuthenticationState).toBeCalledWith(expected);
    });

    it('should use standard mock auth state if mock provided', () => {
      const expected = { isLoggedIn: true, initialized: true };
      mocks.standard = { authState: { isLoggedIn: true } };
      useMockContext.mockReturnValue('unknown');
      useEffect.mockImplementationOnce((callback) => callback());

      useAuthentication();

      expect(mockSetAuthenticationState).toBeCalledWith(expected);
    });
  });
});
