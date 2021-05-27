import React from 'react';
import PropTypes from 'prop-types';
import * as featureStyle from './feature.module.css';

function Feature({ description, imageSrc }) {
  return (
    <div>
      <div className="container">
        <div className="row justify-content-md-between align-items-center">
          <div className="col-md-8 fs-2 text-center text-md-start">
            {description}
          </div>
          <div className="col-md-4 mt-3 mt-md-0 text-center text-md-end">
            <img
              src={imageSrc}
              className={featureStyle.featureLogo}
              alt="Feature Logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Feature.propTypes = {
  description: PropTypes.node,
  imageSrc: PropTypes.string,
};

export default Feature;
