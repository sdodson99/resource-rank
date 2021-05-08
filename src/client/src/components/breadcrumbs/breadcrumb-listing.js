import React from 'react';
import PropTypes from 'prop-types';
import * as breadcrumbListingStyle from './breadcrumb-listing.module.css';
import { Link } from 'gatsby';

function BreadcrumbListing({ breadcrumbs }) {
  const breadcrumbItems = breadcrumbs.map(({ to, title }) => (
    <li key={title} className="breadcrumb-item">
      <Link to={to} activeClassName={breadcrumbListingStyle.activeBreadcrumb}>
        {title}
      </Link>
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
