import React from 'react';
import PropTypes from 'prop-types';
import styles from './PageHeaderButton.module.css';
import Link from 'next/link';

const PageHeaderButton = ({ title, buttonContent, hideButton, linkTo }) => (
  <div className={styles.PageHeaderButton} data-testid="PageHeaderButton">
    <div className="flex flex-col items-center justify-between text-center sm:flex-row sm:text-left">
      <div className="text-4xl">{title}</div>

      {!hideButton && (
        <div className="mt-3 flex sm:mt-0 sm:ml-3">
          <Link href={linkTo}>
            <a className="btn btn-primary">{buttonContent}</a>
          </Link>
        </div>
      )}
    </div>
  </div>
);

PageHeaderButton.propTypes = {
  title: PropTypes.string,
  buttonContent: PropTypes.string,
  hideButton: PropTypes.bool,
  linkTo: PropTypes.string,
};

PageHeaderButton.defaultProps = {
  linkTo: '',
};

export default PageHeaderButton;
