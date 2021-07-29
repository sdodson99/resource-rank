import React from 'react';
import PropTypes from 'prop-types';
import styles from './Layout.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import useReadOnlyModeEnabledQuery from '@/hooks/queries/use-read-only-mode-enabled-query';

const Layout = ({ children }) => {
  const readOnlyModeEnabled = useReadOnlyModeEnabledQuery();

  return (
    <div className={styles.Layout} data-testid="Layout">
      <div className={styles.Page}>
        {readOnlyModeEnabled && (
          <div className={styles.Alert}>Application is in read-only mode.</div>
        )}
        <Header />
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {};

export default Layout;
