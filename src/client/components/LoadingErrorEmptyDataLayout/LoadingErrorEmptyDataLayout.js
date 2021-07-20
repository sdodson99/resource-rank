import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingErrorEmptyDataLayout.module.css';

const LoadingErrorEmptyDataLayout = ({
  isLoading,
  loadingDisplay,
  hasError,
  errorDisplay,
  hasData,
  dataDisplay,
  noDataDisplay,
}) => (
  <div
    className={styles.LoadingErrorEmptyDataLayout}
    data-testid="LoadingErrorEmptyDataLayout"
  >
    {isLoading && loadingDisplay}

    {!isLoading && (
      <div>
        {hasError && errorDisplay}

        {!hasError && (
          <div>
            {!hasData && noDataDisplay}

            {hasData && dataDisplay}
          </div>
        )}
      </div>
    )}
  </div>
);

LoadingErrorEmptyDataLayout.propTypes = {
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  hasData: PropTypes.bool,
  loadingDisplay: PropTypes.node,
  errorDisplay: PropTypes.node,
  noDataDisplay: PropTypes.node,
  dataDisplay: PropTypes.node,
};

LoadingErrorEmptyDataLayout.defaultProps = {
  hasData: true,
};

export default LoadingErrorEmptyDataLayout;
