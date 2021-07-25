import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ActiveLink = ({
  href,
  className,
  activeClassName,
  linkClassName,
  children,
}) => {
  const router = useRouter();

  const asPath = router?.asPath ?? '';
  const route = asPath.split('?')[0];

  if (href === route) {
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
        <a className={linkClassName}>{children}</a>
      </Link>
    </div>
  );
};

ActiveLink.propTypes = {
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  linkClassName: PropTypes.string,
  children: PropTypes.node,
};

ActiveLink.defaultProps = {
  href: '#',
  className: '',
  activeClassName: 'active',
  linkClassName: '',
};

export default ActiveLink;
