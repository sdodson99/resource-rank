import React from 'react';
import PropTypes from 'prop-types';
import styles from './BreadcrumbLayout.module.css';
import Layout from '../Layout/Layout';
import ActiveLink from '../ActiveLink/ActiveLink';

const BreadcrumbLayout = ({ children, breadcrumbs }) => {
  const breadcrumbItems = breadcrumbs.map(({ to, title }, index) => {
    const isLastBreadcrumb = breadcrumbs.length - 1 === index;

    return (
      <li key={to} className="flex">
        <ActiveLink
          href={to}
          className={styles.BreadcrumbItem}
          activeClassName={styles.ActiveBreadcrumbItem}
        >
          {title}
        </ActiveLink>

        {!isLastBreadcrumb && <div className="px-3">/</div>}
      </li>
    );
  });

  return (
    <div className={styles.BreadcrumbLayout} data-testid="BreadcrumbLayout">
      <Layout>
        <div className={`${styles.LayoutContent} content-container`}>
          <nav className={styles.BreadcrumbContent} aria-label="breadcrumb">
            <ol className="flex">{breadcrumbItems}</ol>
          </nav>
          <div className="mt-8">{children}</div>
        </div>
      </Layout>
    </div>
  );
};

BreadcrumbLayout.propTypes = {
  children: PropTypes.node,
  breadcrumbs: PropTypes.array,
};

BreadcrumbLayout.defaultProps = {
  breadcrumbs: [],
};

export default BreadcrumbLayout;
