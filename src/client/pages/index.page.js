import React from 'react';
import FeatureListing from '@/components/FeatureListing/FeatureListing';
import CallToAction from '@/components/CallToAction/CallToAction';
import Layout from '@/components/Layout/Layout';
import Hero from '@/components/Hero/Hero';
import { NextSeo } from 'next-seo';

const Home = () => {
  const features = [
    {
      title: 'Instantly Find the Best Resources',
      description:
        'We rank resources based on feedback from users. This allows you to quickly find the most useful resources.',
      imageSrc: '/img/instantly-find.svg',
    },
    {
      title: 'Explore Topics',
      description:
        'Not sure where to start? Find your next learning journey by browsing through our list of topics.',
      imageSrc: '/img/explore.svg',
    },
    {
      title: 'Give Your Opinion',
      description: 'Rate resources based on helpfulness for learning a topic.',
      imageSrc: '/img/rate-resources.svg',
    },
    {
      title: 'Contribute',
      description: 'Add your own new topics and resources that are useful.',
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
};

export default Home;
