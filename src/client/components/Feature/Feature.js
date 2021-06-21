import React from 'react';
import PropTypes from 'prop-types';
import styles from './Feature.module.css';

const Feature = ({ description, imageSrc }) => (
  <div className={styles.Feature} data-testid="Feature">
    <div className={styles.FeatureDescription}>{description}</div>
    <img src={imageSrc} className={styles.FeatureImage} alt="Feature Image" />
  </div>
);

Feature.propTypes = {
  description: PropTypes.node,
  imageSrc: PropTypes.string,
};

Feature.defaultProps = {
  description: '',
};

export default Feature;
