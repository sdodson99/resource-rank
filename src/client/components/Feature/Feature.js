import React from 'react';
import PropTypes from 'prop-types';
import styles from './Feature.module.css';

const Feature = ({ feature }) => {
  const { title, description, imageSrc } = feature;

  return (
    <div className={styles.Feature} data-testid="Feature">
      <div>
        <img className={styles.Image} src={imageSrc} alt={title} />
      </div>
      <div className={styles.Title}>
        <strong>{title}</strong>
      </div>
      <div className={styles.Description}>{description}</div>
    </div>
  );
};

Feature.propTypes = {
  feature: PropTypes.shape({
    title: PropTypes.node.isRequired,
    description: PropTypes.node.isRequired,
    imageSrc: PropTypes.string.isRequired,
  }).isRequired,
};

Feature.defaultProps = {};

export default Feature;
