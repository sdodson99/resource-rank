import React from 'react';
import FeatureListing from '../components/landing/feature-listing';
import CallToAction from '../components/landing/call-to-action';
import Layout from '../components/layouts/layout';
import Hero from '../components/landing/hero';

export default function Index() {
  const features = [
    {
      title: 'Instant',
      description: (
        <div>
          <strong>Instantly find the best resources</strong> for learning about
          a specific topic.
        </div>
      ),
      imageSrc: '/img/clock.svg',
    },
    {
      title: 'Explore',
      description: (
        <div>
          <strong>Explore topics</strong> to find your next learning journey.
        </div>
      ),
      imageSrc: '/img/mag-glass.svg',
    },
    {
      title: 'Rate',
      description: (
        <div>
          <strong>Rate resources</strong> based on helpfulness for learning a
          topic.
        </div>
      ),
      imageSrc: '/img/star.svg',
    },
    {
      title: 'Contribute',
      description: (
        <div>
          <strong>Add your own new topics and resources</strong> that are
          useful.
        </div>
      ),
      imageSrc: '/img/add.svg',
    },
  ];

  return (
    <Layout>
      {/* <Hero />
      <FeatureListing features={features} />
      <CallToAction /> */}
    </Layout>
  );
}
