import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from '../Link/Link';

const ActiveLink = ({
  url,
  className,
  activeClassName,
  linkClassName,
  children,
}) => {
  const router = useRouter();

  const asPath = router?.asPath ?? '';
  const route = asPath.split('?')[0];
  const { pathname } = url;

  if (pathname === route) {
    return (
      <div
        className={`${className} ${activeClassName}`}
        data-testid="ActiveLink"
      >
        {children}
      </div>
    );
  }

  return (
    <div className={className} data-testid="ActiveLink">
      <Link url={url}>
        <a className={linkClassName}>{children}</a>
      </Link>
    </div>
  );
};

ActiveLink.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
  }).isRequired,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  linkClassName: PropTypes.string,
  children: PropTypes.node,
};

ActiveLink.defaultProps = {
  className: '',
  activeClassName: 'active',
  linkClassName: '',
};

export default ActiveLink;
