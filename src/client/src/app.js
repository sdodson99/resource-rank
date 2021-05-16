import 'regenerator-runtime';
import React from 'react';
import PropTypes from 'prop-types';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import fetch from 'cross-fetch';
import { AuthenticationProvider } from './hooks/authentication/use-authentication-state';
import { FirebaseAppProvider } from './hooks/use-firebase-app';
import 'bootstrap/dist/css/bootstrap.css';
import '@fontsource/magra';
import './styles/app.css';

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
const useAuthenticationEmulator = process.env.USE_AUTHENTICATION_EMULATOR;

const apolloUri = process.env.GQL_URI;

const client = new ApolloClient({
  link: new HttpLink({ uri: apolloUri, fetch }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  },
});

function App({ children }) {
  return (
    <FirebaseAppProvider
      firebaseConfig={firebaseConfig}
      useAuthenticationEmulator={useAuthenticationEmulator}
    >
      <AuthenticationProvider>
        <ApolloProvider client={client}>
          <div>{children}</div>
        </ApolloProvider>
      </AuthenticationProvider>
    </FirebaseAppProvider>
  );
}

App.propTypes = {
  children: PropTypes.node,
};

export default App;
