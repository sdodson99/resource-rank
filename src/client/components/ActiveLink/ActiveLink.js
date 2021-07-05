import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ActiveLink = ({ href, className, activeClassName, children }) => {
  const router = useRouter();

  if (href === router?.asPath) {
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
      <Link href={href}>
        <a>{children}</a>
      </Link>
    </div>
  );
};

ActiveLink.propTypes = {
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  children: PropTypes.node,
};

ActiveLink.defaultProps = {
  href: '#',
  className: '',
  activeClassName: 'active',
};

export default ActiveLink;
