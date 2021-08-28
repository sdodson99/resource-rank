import React from 'react';
import App from '../_app.page';
import { createRenderer } from 'react-test-renderer/shallow';
import { useRouter } from 'next/router';
import useRouteLoadingEffect from '@/hooks/routing/use-route-loading-effect';
import { render } from '@testing-library/react';

jest.mock('next/router');
jest.mock('@/hooks/routing/use-route-loading-effect');

describe('<App />', () => {
  let Component;

  beforeEach(() => {
    useRouter.mockReturnValue({ asPath: '/path' });

    Component = function MockComponent() {
      return <div>Test component</div>;
    };
  });

  afterEach(() => {
    useRouter.mockReset();
    useRouteLoadingEffect.mockReset();
  });

  it('should render correctly', () => {
    const page = createRenderer().render(<App Component={Component} />);

    expect(page).toMatchSnapshot();
  });

  it('should use route loading effect', () => {
    render(<App Component={Component} />);

    expect(useRouteLoadingEffect).toBeCalled();
  });
});
