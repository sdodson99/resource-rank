import React from 'react';
import LinkBase from 'next/link';
import PropTypes from 'prop-types';
import useMockContext from '@/hooks/use-mock-context';

const Link = ({ url, children }) => {
  const mock = useMockContext();

  const getHref = () => {
    if (!mock) {
      return url;
    }

    return {
      ...url,
      query: {
        ...url.query,
        mock,
      },
    };
  };

  return <LinkBase href={getHref()}>{children}</LinkBase>;
};

Link.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
  }).isRequired,
  children: PropTypes.node,
};

Link.defaultProps = {};

export default Link;
