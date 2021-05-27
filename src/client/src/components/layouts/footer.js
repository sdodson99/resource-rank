import React from 'react';
import * as footerStyle from './footer.module.css';
import logo from '../../assets/logo.svg';

function Footer() {
  return (
    <footer>
      <div className="container p-5">
        <div className="row text-center text-sm-start">
          <div className="col-sm order-0 order-sm-1 ms-sm-3">
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
          <div className="col-sm-auto order-1 order-sm-0 mt-3 mt-sm-0">
            <img className={footerStyle.logo} src={logo} alt="Logo" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
