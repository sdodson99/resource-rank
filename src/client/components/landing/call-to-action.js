import Link from 'next/link';
import React from 'react';
import * as actionStyle from './call-to-action.module.css';

function CallToAction() {
  return (
    <div className={`${actionStyle.container} text-white text-center`}>
      <div className={`container py-5 ${actionStyle.content}`}>
        <div className="display-3">What are you waiting for?</div>
        <Link href="/topics" className="btn btn-primary mt-4">
          Explore Topics
        </Link>
      </div>
      <div className={actionStyle.colorOverlay}></div>
    </div>
  );
}

export default CallToAction;
