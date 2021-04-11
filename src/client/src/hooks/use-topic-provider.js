import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const TopicProviderContext = createContext();

function TopicProviderProvider({ children, topicProvider }) {
  return (
    <TopicProviderContext.Provider value={topicProvider}>
      {children}
    </TopicProviderContext.Provider>
  );
}

TopicProviderProvider.propTypes = {
  children: PropTypes.node,
  topicProvider: PropTypes.object,
};

export { TopicProviderProvider };

export default function useTopicProvider() {
  const topicProvider = useContext(TopicProviderContext);
  return topicProvider;
}
