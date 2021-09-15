import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import configuration from '../configuration';

const MockContext = createContext();
const useMockContext = () => useContext(MockContext);

const MockProvider = ({ children }) => {
  const { query, isReady } = useRouter();

  const mockParamLoading = !isReady;
  const mockingEnabled = configuration.ENVIRONMENT !== 'production';

  if (mockingEnabled && mockParamLoading) {
    return null;
  }

  const getMockParam = () => {
    if (!mockingEnabled) {
      return null;
    }

    return query['mock'];
  };

  const mock = getMockParam();

  return <MockContext.Provider value={mock}>{children}</MockContext.Provider>;
};

MockProvider.propTypes = {
  children: PropTypes.node,
};

export { MockProvider };
export default useMockContext;
