import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './PaginatedListing.module.css';
import Listing from '../Listing/Listing';
import Pagination from '../Pagination/Pagination';

const PaginatedListing = ({
  children,
  selectedPage,
  pageCount,
  onPageClick,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPage, pageCount]);

  return (
    <div className={styles.PaginatedListing} data-testid="PaginatedListing">
      <Listing>{children}</Listing>

      <div className="mt-8 flex justify-center">
        <Pagination
          selectedPage={selectedPage}
          pageCount={pageCount}
          onPageClick={onPageClick}
        />
      </div>
    </div>
  );
};

PaginatedListing.propTypes = {
  children: PropTypes.node,
  selectedPage: PropTypes.number,
  pageCount: PropTypes.number,
  onPageClick: PropTypes.func,
};

PaginatedListing.defaultProps = {};

export default PaginatedListing;
