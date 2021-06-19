import 'regenerator-runtime';
import React from 'react';
import PropTypes from 'prop-types';
import { AuthenticationProvider } from './hooks/authentication/use-authentication-state';
import { FirebaseAppProvider } from './hooks/use-firebase-app';
import AuthenticationApolloProvider from './components/authentication-apollo-provider';
import 'bootstrap/dist/css/bootstrap.css';
import '@fontsource/magra';
import '@fontsource/magra/700.css';
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
const useAuthenticationEmulator =
  process.env.USE_AUTHENTICATION_EMULATOR === 'true';
const apolloUri = process.env.GQL_URI;

function App({ children }) {
  return (
    <FirebaseAppProvider
      firebaseConfig={firebaseConfig}
      useAuthenticationEmulator={useAuthenticationEmulator}
    >
      <AuthenticationProvider>
        <AuthenticationApolloProvider apolloUri={apolloUri}>
          <div>{children}</div>
        </AuthenticationApolloProvider>
      </AuthenticationProvider>
    </FirebaseAppProvider>
  );
}

App.propTypes = {
  children: PropTypes.node,
};

export default App;
