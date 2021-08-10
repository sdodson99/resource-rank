import React from 'react';
import PropTypes from 'prop-types';
import styles from './ResourceDetails.module.css';

const ResourceDetails = ({ link }) => (
  <div className={styles.ResourceDetails} data-testid="ResourceDetails">
    <div className="flex">
      <div>Link:</div>
      <div className="ml-4">
        {link && (
          <a
            className="hyperlink break-all"
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            {link}
          </a>
        )}
        {!link && 'No resource link added.'}
      </div>
    </div>
  </div>
);

ResourceDetails.propTypes = {
  link: PropTypes.string,
};

ResourceDetails.defaultProps = {};

export default ResourceDetails;
