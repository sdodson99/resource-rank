import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Alert.module.css';
import { useIntersectionObserver } from 'react-intersection-observer-hook';

const Alert = ({ children, icon, border, className, scrollTo }) => {
  const [alertRef, { entry }] = useIntersectionObserver();
  const isVisible = entry?.isIntersecting;

  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
  useEffect(() => {
    setHasScrolledIntoView(false);
  }, [scrollTo]);
  useEffect(() => {
    if (!scrollTo) {
      return;
    }

    if (hasScrolledIntoView) {
      return;
    }

    if (!entry) {
      return;
    }

    if (!isVisible) {
      entry.target.scrollIntoView();
    }

    setHasScrolledIntoView(true);
  }, [scrollTo, isVisible, hasScrolledIntoView, entry]);

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
