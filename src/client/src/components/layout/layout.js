import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'gatsby';

import * as layoutStyle from './layout.module.css';

function Layout({ children }) {
  return (
    <div>
      <header className="py-3">
        <div
          className={`container ${layoutStyle.container} text-center text-sm-start`}
        >
          <Link to="/" className={layoutStyle.title}>
            Res Rank
          </Link>
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
