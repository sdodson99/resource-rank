import React, { useState } from 'react';
import styles from './Hero.module.css';
import { useRouter } from 'next/router';

const Hero = () => {
  const [searchTopicsQuery, setSearchTopicsQuery] = useState('');
  const router = useRouter();

  const onSearchTopicsQueryChange = (e) => {
    const value = e.target.value;

    setSearchTopicsQuery(value);
  };

  const onSearchTopics = () => {
    router.push(`/topics?q=${searchTopicsQuery}`);
  };

  return (
    <div className={styles.Hero} data-testid="Hero">
      <div className={`content-container ${styles.Content}`}>
        <div className="text-7xl">What are you planning to learn?</div>
        <div className={styles.Search}>
          <input
            type="text"
            className="flex-grow block form-control-lg"
            placeholder="Search topics..."
            value={searchTopicsQuery}
            onChange={onSearchTopicsQueryChange}
          />
          <button
            className="mt-5 sm:mt-0 sm:ml-8 btn btn-primary"
            onClick={onSearchTopics}
          >
            Search
          </button>
        </div>
        <div className="mt-24">
          <div className="text-2xl">
            <strong>Resource Rank</strong> helps you find the{' '}
            <strong>best</strong> resources for your learning journey.
          </div>
          <div className="mt-8 flex justify-center">
            <img
              src="/img/logo.svg"
              alt="Resource Rank Logo"
              height="100"
              width="100"
            />
          </div>
        </div>
      </div>
      <div className={styles.ColorOverlay}></div>
    </div>
  );
};

Hero.propTypes = {};

Hero.defaultProps = {};

export default Hero;
