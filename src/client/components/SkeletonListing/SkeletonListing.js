import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './SkeletonListing.module.css';

const SkeletonListing = () => (
  <div className={styles.SkeletonListing} data-testid="SkeletonListing">
    <Skeleton className="mb-3" count={3} height={100} />
  </div>
);

export default SkeletonListing;
