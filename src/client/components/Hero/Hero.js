import React from 'react';
import styles from './Hero.module.css';
import { ArrowForward } from '@material-ui/icons';
import Link from '../Link/Link';

const Hero = () => (
  <div className={styles.Hero} data-testid="Hero">
    <div className="content-container md:flex items-center justify-between">
      <div className={styles.PromptSection}>
        <div className={styles.Prompt}>
          <strong>
            <span className={styles.Emphasis}>Level up</span> your{' '}
            <span className={styles.Emphasis}>learning</span>.
          </strong>
        </div>
        <div className={styles.SubPrompt}>
          <span className={styles.Emphasis}>Resource Rank</span> helps you find
          the <span className={styles.Emphasis}>best</span> resources for your{' '}
          <span className={styles.Emphasis}>learning journey</span>.
        </div>
        <div className="mt-12 flex justify-center md:justify-start">
          <Link url={{ pathname: '/topics' }}>
            <a className="btn btn-primary flex items-center">
              Explore Topics
              <span className="ml-2">
                <ArrowForward />
              </span>
            </a>
          </Link>
        </div>
      </div>
      <div className={styles.IllustrationSection}>
        <div className="flex items-center justify-center">
          <img className={styles.Illustration} src="/img/hero.svg" />
        </div>
      </div>
    </div>
  </div>
);

Hero.propTypes = {};

Hero.defaultProps = {};

export default Hero;
