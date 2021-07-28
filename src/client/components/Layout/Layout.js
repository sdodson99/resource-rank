import React from 'react';
import PropTypes from 'prop-types';
import styles from './Layout.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import useReadOnlyModeStatus from '@/hooks/use-read-only-mode-status';

const Layout = ({ children }) => {
  const readOnlyModeEnabled = useReadOnlyModeStatus();

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
