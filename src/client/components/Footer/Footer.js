import React from 'react';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.Footer} data-testid="Footer">
    <div className="content-container">
      <div className="sm:flex text-center sm:text-left">
        <div className="sm:order-2 sm:ml-10">
          <h1 className="text-4xl">Our Mission</h1>
          <p className="py-3">
            is to <strong>simplify</strong> your learning journey. Learning can
            be <strong>difficult</strong>, especially when starting. There are{' '}
            <strong>millions</strong> of educational courses, videos, and books{' '}
            <strong>scattered</strong> across the Internet.
          </p>
          <p className="py-3">
            Resource Rank’s goal is to <strong>consolidate</strong> all of these
            resources so that you can <strong>quickly</strong> find the{' '}
            <strong>best</strong> resources for what you are learning.
          </p>
        </div>
        <div className="sm:order-1 mt-10 sm:mt-0 flex items-start justify-center sm:justify-start">
          <img
            src="/img/logo.svg"
            alt="Resource Rank Logo"
            height="75"
            width="75"
          />
        </div>
      </div>
    </div>
  </footer>
);

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
