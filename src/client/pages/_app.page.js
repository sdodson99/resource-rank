import '@/styles/globals.css';
import React from 'react';
import PropTypes from 'prop-types';
import { AuthenticationProvider } from '@/hooks/use-authentication-context';
import { FirebaseAppProvider } from '@/hooks/use-firebase-app-context';
import '@fontsource/magra';
import '@fontsource/magra/700.css';
import { GraphQLFetcherProvider } from '@/hooks/graphql/use-graphql-fetcher';

const firebaseConfig = {
  apiKey: 'AIzaSyChFnYmkhARBy0Hwtehlx-81rSC7PZZWT8',
  authDomain: 'resource-rank.firebaseapp.com',
  databaseURL: 'https://resource-rank-default-rtdb.firebaseio.com',
  projectId: 'resource-rank',
  storageBucket: 'resource-rank.appspot.com',
  messagingSenderId: '489304913015',
  appId: '1:489304913015:web:71f38a965ccde83db54272',
  measurementId: 'G-D18DVJ4168',
};
const useAuthenticationEmulator =
  process.env.NEXT_PUBLIC_USE_AUTHENTICATION_EMULATOR === 'true';

function App({ Component, pageProps }) {
  return (
    <FirebaseAppProvider
      firebaseConfig={firebaseConfig}
      useAuthenticationEmulator={useAuthenticationEmulator}
    >
      <AuthenticationProvider>
        <GraphQLFetcherProvider>
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
