import React from 'react';
import PropTypes from 'prop-types';
import * as breadcrumbListingStyle from './breadcrumb-listing.module.css';
import Link from 'next/link';

function BreadcrumbListing({ breadcrumbs }) {
  const breadcrumbItems = breadcrumbs.map(({ to, title }) => (
    <li key={to} className="breadcrumb-item">
      <Link href={to}>{title}</Link>
    </li>
  ));

  return (
    <nav className="bg-light p-3 rounded" aria-label="breadcrumb">
      <ol className="breadcrumb mb-0">{breadcrumbItems}</ol>
    </nav>
  );
}

BreadcrumbListing.propTypes = {
  breadcrumbs: PropTypes.array,
};

export default BreadcrumbListing;
