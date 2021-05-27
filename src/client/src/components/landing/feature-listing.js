import React from 'react';
import PropTypes from 'prop-types';
import Feature from './feature';
import * as featureListingStyle from './feature-listing.module.css';

function FeatureListing({ features }) {
  const featureItems = features.map((f) => (
    <div
      className={`py-3 ${featureListingStyle.featureItem} d-flex flex-column justify-content-center align-items-center`}
      key={f.title}
    >
      <Feature description={f.description} imageSrc={f.imageSrc} />
    </div>
  ));

  return <div>{featureItems}</div>;
}

FeatureListing.propTypes = {
  features: PropTypes.array,
};

export default FeatureListing;
