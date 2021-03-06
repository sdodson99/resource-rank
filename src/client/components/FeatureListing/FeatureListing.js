import React from 'react';
import PropTypes from 'prop-types';
import styles from './FeatureListing.module.css';
import Feature from '../Feature/Feature';

const FeatureListing = ({ features }) => {
  const featureItems = features.map((f) => (
    <div className={styles.FeatureItem} key={f.title}>
      <div className="content-container flex-grow">
        <Feature feature={f} />
      </div>
    </div>
  ));

  return (
    <div className={styles.FeatureListing} data-testid="FeatureListing">
      {featureItems}
    </div>
  );
};

FeatureListing.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node.isRequired,
      description: PropTypes.node.isRequired,
      imageSrc: PropTypes.string.isRequired,
    })
  ),
};

FeatureListing.defaultProps = {
  features: [],
};

export default FeatureListing;
