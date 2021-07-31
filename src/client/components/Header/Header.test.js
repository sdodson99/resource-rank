import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import Header from './Header';
import { useRouter } from 'next/router';
import useFirebaseAppContext from '../../hooks/use-firebase-app-context';
import useAuthenticationContext from '../../hooks/use-authentication-context';
import 'firebase/auth';

jest.mock('../../hooks/use-authentication-context');
jest.mock('../../hooks/use-firebase-app-context');
jest.mock('next/router');

describe('<Header />', () => {
  let mockFirebaseApp;
  let mockSignIn;
  let mockSignOut;

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

    useAuthenticationContext.mockReturnValue({ isLoggedIn: false });
  });

  afterEach(() => {
    useRouter.mockReset();
    useFirebaseAppContext.mockReset();
    useAuthenticationContext.mockReset();
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
  });
});
