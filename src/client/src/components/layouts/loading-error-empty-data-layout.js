import React from 'react';
import PropTypes from 'prop-types';

function LoadingErrorEmptyDataLayout({
  isLoading,
  hasError,
  hasData,
  loadingDisplay,
  errorDisplay,
  noDataDisplay,
  dataDisplay,
}) {
  return (
    <div>
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
}

LoadingErrorEmptyDataLayout.propTypes = {
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  hasData: PropTypes.bool,
  loadingDisplay: PropTypes.node,
  errorDisplay: PropTypes.node,
  noDataDisplay: PropTypes.node,
  dataDisplay: PropTypes.node,
};

export default LoadingErrorEmptyDataLayout;
