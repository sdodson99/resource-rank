import React from 'react';
import App from '@/pages/_app.page';
import { useRouter } from 'next/router';

export default function withApp(Component, props, { mock = 'standard' } = {}) {
  useRouter.mockReturnValue({
    asPath: '/',
    query: { mock },
    isReady: true,
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  });

  return <App Component={Component} pageProps={props} />;
}
