import React from 'react';
import PropTypes from 'prop-types';
import styles from './Alert.module.css';

const Alert = ({ children, icon, border, className }) => {
  const calculateClassName = () => {
    let totalClassName = styles.Alert;

    if (border) {
      totalClassName += ' border rounded';
    }

    if (className) {
      totalClassName += ` ${className}`;
    }

    return totalClassName;
  };

  return (
    <div className={calculateClassName()} data-testid="Alert">
      {icon && <div className="mr-2 inline-block align-middle">{icon}</div>}
      <div className="inline-block align-middle">{children}</div>
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  border: PropTypes.bool,
  className: PropTypes.string,
};

Alert.defaultProps = {};

export default Alert;
