import React, { useState } from 'react';
import { useRouter } from 'next/router';
import * as heroStyle from './hero.module.css';
import Image from 'next/image';

function Hero() {
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
    <div className={`${heroStyle.container} text-white text-center`}>
      <div className={`container py-5 ${heroStyle.content}`}>
        <div className="display-1">What are you planning to learn?</div>
        <div className="row mt-5 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="col-sm">
            <input
              type="text"
              className="form-control"
              placeholder="Search topics..."
              value={searchTopicsQuery}
              onChange={onSearchTopicsQueryChange}
            />
          </div>
          <div className="col-sm-auto">
            <button className="mt-2 mt-sm-0 w-100" onClick={onSearchTopics}>
              Search
            </button>
          </div>
        </div>
        <div className={heroStyle.description}>
          <div className="fs-4">
            <strong>Resource Rank</strong> helps you find the{' '}
            <strong>best</strong> resources for your learning journey.
          </div>
          <div className="mt-4">
            <Image
              src="/img/logo.svg"
              alt="Resource Rank Logo"
              height="75"
              width="75"
            />
          </div>
        </div>
      </div>
      <div className={heroStyle.colorOverlay}></div>
    </div>
  );
}

export default Hero;
