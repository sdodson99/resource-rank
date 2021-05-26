import React from 'react';
import { Button } from 'react-bootstrap';
import logo from '../../assets/logo.svg';
import * as heroStyle from './hero.module.css';

function Hero() {
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
            />
          </div>
          <div className="col-sm-auto">
            <Button variant="primary" className="mt-2 mt-sm-0 w-100">
              Search
            </Button>
          </div>
        </div>
        <div className={heroStyle.description}>
          <div className="fs-4">
            <strong>Resource Rank</strong> helps you find the{' '}
            <strong>best</strong> resources for your learning journey.
          </div>
          <div className="mt-4">
            <img className={heroStyle.logo} src={logo} alt="Logo" />
          </div>
        </div>
      </div>
      <div className={heroStyle.colorOverlay}></div>
    </div>
  );
}

export default Hero;
