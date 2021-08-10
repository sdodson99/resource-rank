import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size, color }) => (
  <div className={styles.LoadingSpinner} data-testid="LoadingSpinner">
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M95 50C95 59.6293 91.9111 69.0047 86.1874 76.7483C80.4636 84.4919 72.4069 90.1952 63.2012 93.0201C53.9956 95.845 44.1265 95.6424 35.0445 92.4421C25.9625 89.2419 18.1466 83.2127 12.7454 75.2408C7.34427 67.2689 4.64275 57.7746 5.03791 48.1534C5.43306 38.5321 8.90405 29.2914 14.9407 21.7892C20.9774 14.287 29.2615 8.91914 38.5753 6.47442C47.8891 4.0297 57.7416 4.6371 66.6846 8.20736"
        stroke={color}
        strokeWidth="10"
      />
    </svg>
  </div>
);

LoadingSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

LoadingSpinner.defaultProps = {
  size: 50,
  color: '#292929',
};

export default LoadingSpinner;
