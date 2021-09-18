import React from 'react';
import configuration from '@/configuration/';
import { useRouter } from 'next/router';
import useMockContext, { MockProvider } from '../use-mock-context';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router');
jest.mock('@/configuration/');

const MockComponent = () => {
  const mock = useMockContext();

  return <div data-testid="MockComponent">{mock}</div>;
};

const renderComponent = () => {
  render(
    <MockProvider>
      <MockComponent />
    </MockProvider>
  );
};

describe('MockProvider', () => {
  afterEach(() => {
    useRouter.mockReset();
    configuration.ENVIRONMENT = null;
  });

  it('should not render children when mock param loading in non-production', () => {
    useRouter.mockReturnValue({ isReady: false });
    configuration.ENVIRONMENT = 'development';
    renderComponent();

    const mockComponent = screen.queryByTestId('MockComponent');

    expect(mockComponent).toBeNull();
  });

  it('should use mock value when ready in non-production', () => {
    const mockParam = 'super';
    useRouter.mockReturnValue({
      isReady: true,
      query: {
        mock: mockParam,
      },
    });
    configuration.ENVIRONMENT = 'development';
    renderComponent();

    const mockComponent = screen.getByTestId('MockComponent');

    expect(mockComponent.innerHTML).toBe(mockParam);
  });

  it('should not use mock value in production', () => {
    const mockParam = 'super';
    useRouter.mockReturnValue({
      isReady: true,
      query: {
        mock: mockParam,
      },
    });
    configuration.ENVIRONMENT = 'production';
    renderComponent();

    const mockComponent = screen.getByTestId('MockComponent');

    expect(mockComponent.innerHTML).not.toBe(mockParam);
  });
});
