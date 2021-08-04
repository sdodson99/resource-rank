import '@/styles/globals.css';
import React from 'react';
import PropTypes from 'prop-types';
import { AuthenticationProvider } from '@/hooks/use-authentication-context';
import { FirebaseAppProvider } from '@/hooks/use-firebase-app-context';
import '@fontsource/magra';
import '@fontsource/magra/700.css';
import { GraphQLFetcherProvider } from '@/hooks/graphql/use-graphql-fetcher';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import configuration from '@/configuration/index';
import path from 'path';

function App({ Component, pageProps }) {
  const { asPath } = useRouter();

  const currentUrl = path.join(configuration.BASE_URL, asPath);
  const imageUrl = path.join(configuration.BASE_URL, 'img/logo.jpg');

  return (
    <FirebaseAppProvider
      firebaseConfig={configuration.FIREBASE_CONFIG}
      useAuthenticationEmulator={configuration.USE_AUTHENTICATION_EMULATOR}
    >
      <AuthenticationProvider>
        <GraphQLFetcherProvider>
          <DefaultSeo
            titleTemplate="%s - Resource Rank"
            title="Simplify Learning"
            description="Find the best resources to simplify your learning journey."
            openGraph={{
              title: 'Simplify Learning - Resource Rank',
              description:
                'Find the best resources to simplify your learning journey.',
              url: currentUrl,
              type: 'website',
              images: [
                {
                  url: imageUrl,
                  width: 300,
                  height: 300,
                  alt: 'Resource Rank Logo',
                },
              ],
            }}
          />
          <Component {...pageProps} />
        </GraphQLFetcherProvider>
      </AuthenticationProvider>
    </FirebaseAppProvider>
  );
}

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};

export default App;
