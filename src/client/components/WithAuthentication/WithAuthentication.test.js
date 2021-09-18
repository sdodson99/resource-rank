import React from 'react';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import withAuthentication from './WithAuthentication';
import withApp from '@/test-utils/with-app';
import useAuthenticationContext from '@/hooks/use-authentication-context';

jest.mock('@/hooks/use-authentication-context', () => ({
  ...jest.requireActual('@/hooks/use-authentication-context'),
  __esModule: true,
  default: jest.fn(),
}));

const MockComponent = ({ children }) => <div>{children}</div>;
MockComponent.propTypes = {
  children: PropTypes.node,
};

describe('<WithAuthentication />', () => {
  let Component;

  beforeEach(() => {
    Component = withAuthentication(MockComponent);
  });

  afterEach(() => {
    useAuthenticationContext.mockReset();
  });

  it('should render loading spinner when auth state initializing', () => {
    useAuthenticationContext.mockReturnValue({
      initialized: false,
    });
    render(withApp(Component));

    const loadingSpinner = screen.getByTestId('LoadingSpinner');

    expect(loadingSpinner).toBeInTheDocument();
  });

  it('should render component with props when user authenticated after auth state initialized', () => {
    useAuthenticationContext.mockReturnValue({
      isLoggedIn: true,
      initialized: true,
    });
    render(withApp(Component, { children: 'MockChildren' }));

    const mockComponent = screen.getByText('MockChildren');

    expect(mockComponent).toBeInTheDocument();
  });

  it('should render login prompt when user not authenticated after auth state initialized', () => {
    useAuthenticationContext.mockReturnValue({
      isLoggedIn: false,
      initialized: true,
    });
    render(withApp(Component));

    const loginPrompt = screen.getByText('You must login to view this page.');

    expect(loginPrompt).toBeInTheDocument();
  });
});
