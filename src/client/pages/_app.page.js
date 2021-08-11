import '@/styles/globals.css';
import '@fontsource/magra/index.css';
import '@fontsource/magra/700.css';
import React from 'react';
import PropTypes from 'prop-types';
import { AuthenticationProvider } from '@/hooks/use-authentication-context';
import { FirebaseAppProvider } from '@/hooks/use-firebase-app-context';
import { GraphQLFetcherProvider } from '@/hooks/graphql/use-graphql-fetcher';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import configuration from '@/configuration/index';
import Head from 'next/head';

function App({ Component, pageProps }) {
  const { asPath } = useRouter();

  const currentUrl = `${configuration.HTTPS_BASE_URL}${asPath}`;
  const imageUrl = `${configuration.HTTP_BASE_URL}/img/og-logo.jpg`;

  return (
    <FirebaseAppProvider
      firebaseConfig={configuration.FIREBASE_CONFIG}
      useAuthenticationEmulator={configuration.USE_AUTHENTICATION_EMULATOR}
    >
      <AuthenticationProvider>
        <GraphQLFetcherProvider>
          <Head>
            <link
              href="https://fonts.googleapis.com/css?family=Kanit:100,400,700,400i,700i"
              rel="stylesheet"
            />
          </Head>
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
                  width: 1200,
                  height: 630,
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
