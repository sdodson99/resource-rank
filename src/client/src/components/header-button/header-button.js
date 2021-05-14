import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

function HeaderButton({ title, buttonContent, linkTo, className }) {
  return (
    <div className={className}>
      <div className="row align-items-center justify-content-between">
        <div className="col-auto">
          <div className="page-header">{title}</div>
        </div>
        <div className="col-auto">
          <Link className="btn btn-primary font-sm" to={linkTo}>
            {buttonContent}
          </Link>
        </div>
      </div>
    </div>
  );
}

HeaderButton.propTypes = {
  title: PropTypes.string,
  buttonContent: PropTypes.string,
  linkTo: PropTypes.string,
  className: PropTypes.string,
};

export default HeaderButton;
