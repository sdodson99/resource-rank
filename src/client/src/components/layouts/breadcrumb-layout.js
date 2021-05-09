import React from 'react';
import PropTypes from 'prop-types';
import Layout from './layout';
import BreadcrumbListing from '../breadcrumbs/breadcrumb-listing';

function BreadcrumbLayout({ children, breadcrumbs }) {
  return (
    <Layout>
      <BreadcrumbListing breadcrumbs={breadcrumbs} />
      <div className="mt-4">{children}</div>
    </Layout>
  );
}

BreadcrumbLayout.propTypes = {
  children: PropTypes.node,
  breadcrumbs: PropTypes.array,
};

export default BreadcrumbLayout;
