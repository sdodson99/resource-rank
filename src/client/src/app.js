import 'regenerator-runtime';
import React from 'react';
import PropTypes from 'prop-types';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import 'bootstrap/dist/css/bootstrap.css';

import '@fontsource/magra';
import './styles/app.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
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
    <ApolloProvider client={client}>
      <div>{children}</div>
    </ApolloProvider>
  );
}

App.propTypes = {
  children: PropTypes.node,
};

export default App;