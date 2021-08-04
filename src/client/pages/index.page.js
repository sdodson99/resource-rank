import React from 'react';
import FeatureListing from '@/components/FeatureListing/FeatureListing';
import CallToAction from '@/components/CallToAction/CallToAction';
import Layout from '@/components/Layout/Layout';
import Hero from '@/components/Hero/Hero';
import { NextSeo } from 'next-seo';

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
      imageSrc: '/img/instantly-find.svg',
    },
    {
      title: 'Explore',
      description: (
        <div>
          <strong>Explore topics</strong> to find your next learning journey.
        </div>
      ),
      imageSrc: '/img/explore.svg',
    },
    {
      title: 'Rate',
      description: (
        <div>
          <strong>Rate resources</strong> based on helpfulness for learning a
          topic.
        </div>
      ),
      imageSrc: '/img/rate-resources.svg',
    },
    {
      title: 'Contribute',
      description: (
        <div>
          <strong>Add your own new topics and resources</strong> that are
          useful.
        </div>
      ),
      imageSrc: '/img/add-your-own.svg',
    },
  ];

  return (
    <Layout>
      <NextSeo
        title="Home"
        openGraph={{
          title: 'Home - Resource Rank',
        }}
      />
      <Hero />
      <FeatureListing features={features} />
      <CallToAction />
    </Layout>
  );
}
