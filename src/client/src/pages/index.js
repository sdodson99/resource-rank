import React from 'react';
import FeatureListing from '../components/landing/feature-listing';
import Layout from '../components/layouts/layout';
import clock from '../assets/clock.svg';
import magnifyingGlass from '../assets/mag-glass.svg';
import star from '../assets/star.svg';
import add from '../assets/add.svg';

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
      imageSrc: clock,
    },
    {
      title: 'Explore',
      description: (
        <div>
          <strong>Explore topics</strong> to find your next learning journey.
        </div>
      ),
      imageSrc: magnifyingGlass,
    },
    {
      title: 'Rate',
      description: (
        <div>
          <strong>Rate resources</strong> based on helpfulness for learning a
          topic.
        </div>
      ),
      imageSrc: star,
    },
    {
      title: 'Contribute',
      description: (
        <div>
          <strong>Add your own new topics and resources</strong> that are
          useful.
        </div>
      ),
      imageSrc: add,
    },
  ];

  return (
    <Layout>
      <FeatureListing features={features} />
    </Layout>
  );
}
