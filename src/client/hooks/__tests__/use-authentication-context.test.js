import { useAuthentication } from '../use-authentication-context';
import { useEffect, useState } from 'react';
import useFirebaseAppContext from '../use-firebase-app-context';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
jest.mock('../use-firebase-app-context');

describe('useAuthentication', () => {
  afterEach(() => {
    useEffect.mockReset();
    useState.mockReset();
    useFirebaseAppContext.mockReset();
  });

  it('should return authentication state', () => {
    const expected = {
      isLoggedIn: false,
      currentUser: null,
      initialized: false,
    };
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
    const mockSetAuthenticationState = jest.fn();
    useState.mockReturnValue([null, mockSetAuthenticationState]);
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
    useState.mockReturnValue([null, null]);
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
});
