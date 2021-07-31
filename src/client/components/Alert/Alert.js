import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './Alert.module.css';

const Alert = ({ children, icon, border, className, scrollTo }) => {
  const alertRef = useRef();
  
  useEffect(() => {
    if (scrollTo) {
      alertRef.current?.scrollIntoView();
    }
  }, [scrollTo]);

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
    <div ref={alertRef} className={calculateClassName()} data-testid="Alert">
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
  scrollTo: PropTypes.bool,
};

Alert.defaultProps = {};

export default Alert;
