import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

function HeaderButton({ title, buttonContent, linkTo, className }) {
  return (
    <div className={className}>
      <div className="row align-items-center justify-content-between text-center text-sm-left">
        <div className="col-sm-auto">
          <div className="page-header">{title}</div>
        </div>
        <div className="col-sm-auto mt-2 mt-sm-0">
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
