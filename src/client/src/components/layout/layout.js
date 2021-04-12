import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'gatsby';

import * as layoutStyle from './layout.module.css';

function Layout({ children }) {
  return (
    <div>
      <header className="py-3">
        <div className={`container ${layoutStyle.container}`}>
          <div className="row align-items-center justify-content-center justify-content-sm-between">
            <div className="col-sm-auto text-center text-sm-start">
              <Link to="/" className={layoutStyle.title}>
                Resource Rank
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
