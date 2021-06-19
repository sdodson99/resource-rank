import PropTypes from 'prop-types';
import * as layoutStyle from './layout.module.css';
import useReadOnlyModeStatus from '../../hooks/use-read-only-mode-status';
import Footer from './footer';
import Header from '../Header/Header';

function Layout({ children }) {
  const readOnlyModeEnabled = useReadOnlyModeStatus();

  return (
    <div>
      <div className={layoutStyle.page}>
        {readOnlyModeEnabled && (
          <div className="mb-0 text-center">
            Application is in read-only mode.
          </div>
        )}
        <Header />
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
