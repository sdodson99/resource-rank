import React from 'react';
import styles from './CallToAction.module.css';
import Link from 'next/link';

const CallToAction = () => (
  <div className={styles.CallToAction} data-testid="CallToAction">
    <div className={`content-container ${styles.Content}`}>
      <div className="text-6xl">What are you waiting for?</div>
      <div className="mt-10">
        <Link href="/topics">
          <a className="btn btn-primary">Explore Topics</a>
        </Link>
      </div>
    </div>
    <div className={styles.ColorOverlay}></div>
  </div>
);

CallToAction.propTypes = {};

CallToAction.defaultProps = {};

export default CallToAction;
