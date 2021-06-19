import React from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className={styles.Footer} data-testid="Footer">
      <div>
        <div>
          <div>
            <h1>Our Mission</h1>
            <p>
              is to <strong>simplify</strong> your learning journey. Learning
              can be <strong>difficult</strong>, especially when starting. There
              are <strong>millions</strong> of educational courses, videos, and
              books <strong>scattered</strong> across the Internet.
            </p>
            <p>
              Resource Rank’s goal is to <strong>consolidate</strong> all of
              these resources so that you can <strong>quickly</strong> find the{' '}
              <strong>best</strong> resources for what you are learning.
            </p>
          </div>
          <div>
            <Image
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
};

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
