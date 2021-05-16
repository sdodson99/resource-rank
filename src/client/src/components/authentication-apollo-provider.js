import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'cross-fetch';
import { ApolloProvider } from '@apollo/client';
import firebase from 'firebase';

const createApolloClient = (apolloUri) => {
  const apolloHttpLink = new HttpLink({ uri: apolloUri, fetch });

  const apolloAuthLink = setContext(async (_, { headers }) => {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
      return headers;
    }

    const token = await currentUser.getIdToken();

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const apolloLink = apolloAuthLink.concat(apolloHttpLink);

  return new ApolloClient({
    link: apolloLink,
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
};

function AuthenticationApolloProvider({ children, apolloUri }) {
  const { current: apolloClient } = useRef(createApolloClient(apolloUri));

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}

AuthenticationApolloProvider.propTypes = {
  children: PropTypes.node,
  apolloUri: PropTypes.string,
};

export default AuthenticationApolloProvider;
