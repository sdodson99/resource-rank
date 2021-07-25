import React from 'react';
import FeatureListing from '../components/FeatureListing/FeatureListing';
import CallToAction from '../components/CallToAction/CallToAction';
import Layout from '../components/Layout/Layout';
import Hero from '../components/Hero/Hero';
import Head from 'next/head';

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
      <Head>
        <title>Home - Resource Rank</title>
      </Head>
      <Hero />
      <FeatureListing features={features} />
      <CallToAction />
    </Layout>
  );
}
