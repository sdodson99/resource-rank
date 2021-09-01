import useRouteLoadingEffect from '../use-route-loading-effect';
import React from 'react';
import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';

jest.mock('next/router');
jest.mock('nprogress');

const MockComponent = () => {
  useRouteLoadingEffect();

  return <div>Mock</div>;
};

describe('useRouteLoadingEffect', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    };
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    useRouter.mockReset();
    NProgress.start.mockReset();
    NProgress.configure.mockReset();
    NProgress.done.mockReset();
  });

  it('should disable NProgress spinner', () => {
    render(<MockComponent />);

    expect(NProgress.configure).toBeCalledTimes(1);
    expect(NProgress.configure).toBeCalledWith({
      showSpinner: false,
    });
  });

  describe('route change start effect', () => {
    it('should subscribe NProgress start when route change starts', () => {
      render(<MockComponent />);

      expect(mockRouter.events.on).toBeCalledWith(
        'routeChangeStart',
        NProgress.start
      );
    });

    it('should unsubscribe NProgress start when component unmounts', () => {
      render(<MockComponent />).unmount();

      expect(mockRouter.events.off).toBeCalledWith(
        'routeChangeStart',
        NProgress.start
      );
    });
  });

  describe('route change complete effect', () => {
    it('should subscribe NProgress start when route change starts', () => {
      render(<MockComponent />);

      expect(mockRouter.events.on).toBeCalledWith(
        'routeChangeComplete',
        NProgress.done
      );
    });

    it('should unsubscribe NProgress start when component unmounts', () => {
      render(<MockComponent />).unmount();

      expect(mockRouter.events.off).toBeCalledWith(
        'routeChangeComplete',
        NProgress.done
      );
    });
  });
});
