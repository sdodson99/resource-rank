import React from 'react';
import PropTypes from 'prop-types';
import { ApolloClient, InMemoryCache } from '@apollo/client';

import 'bootstrap/dist/css/bootstrap.css';

import '@fontsource/magra';
import './styles/app-layout.css';
import { TopicProviderProvider } from './hooks/use-topic-provider';
import TopicProvider from './services/topic-provider';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});
const topicProvider = new TopicProvider(client);

function AppLayout({ children }) {
  return (
    <TopicProviderProvider topicProvider={topicProvider}>
      <div>{children}</div>
    </TopicProviderProvider>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;
