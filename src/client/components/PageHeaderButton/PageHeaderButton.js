import React from 'react';
import PropTypes from 'prop-types';
import styles from './PageHeaderButton.module.css';
import Link from '../Link/Link';

const PageHeaderButton = ({
  title,
  buttonContent,
  hideButton,
  linkTo,
  titleClassName,
}) => (
  <div className={styles.PageHeaderButton} data-testid="PageHeaderButton">
    <div className="flex flex-col items-center justify-between text-center sm:flex-row sm:text-left">
      <div className={titleClassName}>{title}</div>

      {!hideButton && (
        <div className="mt-3 flex sm:mt-0 sm:ml-3">
          <Link url={{ pathname: linkTo }}>
            <a className="btn btn-primary">{buttonContent}</a>
          </Link>
        </div>
      )}
    </div>
  </div>
);

PageHeaderButton.propTypes = {
  title: PropTypes.node,
  buttonContent: PropTypes.node,
  hideButton: PropTypes.bool,
  linkTo: PropTypes.string,
  titleClassName: PropTypes.string,
};

PageHeaderButton.defaultProps = {
  linkTo: '',
  titleClassName: 'text-4xl',
};

export default PageHeaderButton;
