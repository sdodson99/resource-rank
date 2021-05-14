import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'gatsby';
import { Alert } from 'react-bootstrap';

import * as layoutStyle from './layout.module.css';
import logo from '../../assets/logo.svg';
import useReadOnlyModeStatus from '../../hooks/use-read-only-mode-status';

function Layout({ children }) {
  const readOnlyModeEnabled = useReadOnlyModeStatus();

  return (
    <div>
      {readOnlyModeEnabled && (
        <Alert className="mb-0 text-center" variant="warning">
          Application is in read-only mode.
        </Alert>
      )}
      <header className="py-3">
        <div className={`container ${layoutStyle.container}`}>
          <div className="row align-items-center justify-content-center justify-content-sm-between">
            <div className="col-sm-auto text-center text-sm-start">
              <Link to="/" className={layoutStyle.title}>
                <img
                  className={layoutStyle.logo}
                  src={logo}
                  alt="Resource Rank Logo"
                />
              </Link>
            </div>

            <div className="col-auto mt-3 mt-sm-0">
              <Link
                to="/"
                className={layoutStyle.link}
                activeClassName={layoutStyle.active}
              >
                Topics
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className={`py-4 container ${layoutStyle.container}`}>
        {children}
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
