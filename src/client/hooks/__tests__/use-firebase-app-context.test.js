import { useFirebaseApp } from '../use-firebase-app-context';
import firebase from 'firebase/app';

jest.mock('firebase/app');

describe('useFirebaseApp', () => {
  beforeEach(() => {
    firebase.initializeApp = jest.fn();
    firebase.auth = jest.fn();
    firebase.apps.length = 0;
  });

  it('should initialize app if app not initialized', () => {
    useFirebaseApp({
      firebaseConfig: {},
      useAuthenticationEmulator: false,
    });

    expect(firebase.initializeApp).toBeCalled();
  });

  it('should not initialize app if app already initialized', () => {
    firebase.apps.length = 1;

    useFirebaseApp({
      firebaseConfig: {},
      useAuthenticationEmulator: false,
    });

    expect(firebase.initializeApp).not.toBeCalled();
  });

  it('should return firebase app', () => {
    firebase.apps.length = 1;

    const firebaseApp = useFirebaseApp({
      firebaseConfig: {},
      useAuthenticationEmulator: false,
    });

    expect(firebaseApp).toBe(firebase);
  });

  it('should use auth emulator if useAuthenticationEmulator is true', () => {
    const mockUseEmulator = jest.fn();
    firebase.auth.mockReturnValue({
      useEmulator: mockUseEmulator,
    });

    useFirebaseApp({
      firebaseConfig: {},
      useAuthenticationEmulator: true,
    });

    expect(mockUseEmulator).toBeCalled();
  });
});
