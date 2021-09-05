import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import Header from './Header';
import { useRouter } from 'next/router';
import useFirebaseAppContext from '../../hooks/use-firebase-app-context';
import useFirebaseAnalytics from '../../hooks/use-firebase-analytics';
import useAuthenticationContext from '../../hooks/use-authentication-context';
import 'firebase/auth';

jest.mock('../../hooks/use-authentication-context');
jest.mock('../../hooks/use-firebase-app-context');
jest.mock('../../hooks/use-firebase-analytics');
jest.mock('next/router');

describe('<Header />', () => {
  let mockFirebaseApp;
  let mockSignIn;
  let mockSignOut;
  let mockConsoleError;
  let originalConsoleError;

  beforeEach(() => {
    useRouter.mockReturnValue({
      route: '/',
    });

    mockSignIn = jest.fn();
    mockSignOut = jest.fn();
    mockFirebaseApp = {
      auth: () => ({
        signInWithPopup: mockSignIn,
        signOut: mockSignOut,
      }),
    };
    useFirebaseAppContext.mockReturnValue(mockFirebaseApp);
    useFirebaseAnalytics.mockReturnValue({
      logEvent: jest.fn(),
    });

    useAuthenticationContext.mockReturnValue({ isLoggedIn: false });

    mockConsoleError = jest.fn();
    originalConsoleError = console.error;
    console.error = mockConsoleError;
  });

  afterEach(() => {
    useRouter.mockReset();
    useFirebaseAppContext.mockReset();
    useFirebaseAnalytics.mockReset();
    useAuthenticationContext.mockReset();
    console.error = originalConsoleError;
  });

  it('should mount', () => {
    render(<Header />);

    const header = screen.getByTestId('Header');

    expect(header).toBeInTheDocument();
  });

  describe('with not logged in', () => {
    it('should render correctly', () => {
      const tree = renderer.create(<Header />).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('should login when login button clicked', () => {
      render(<Header />);
      const loginButton = screen.getByText('Login');

      loginButton.click();

      expect(mockSignIn).toBeCalled();
    });

    it('should log error on login failure', () => {
      mockSignIn.mockImplementation(() => {
        throw new Error();
      });
      render(<Header />);
      const loginButton = screen.getByText('Login');

      loginButton.click();

      expect(mockConsoleError).toBeCalled();
    });
  });

  describe('with logged in', () => {
    beforeEach(() => {
      useAuthenticationContext.mockReturnValue({ isLoggedIn: true });
    });

    it('should render correctly', () => {
      const tree = renderer.create(<Header />).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('should logout when logout button clicked', () => {
      render(<Header />);
      const logoutButton = screen.getByText('Logout');

      logoutButton.click();

      expect(mockSignOut).toBeCalled();
    });

    it('should log error on logout failure', () => {
      mockSignOut.mockImplementation(() => {
        throw new Error();
      });
      render(<Header />);
      const logoutButton = screen.getByText('Logout');

      logoutButton.click();

      expect(mockConsoleError).toBeCalled();
    });
  });
});
