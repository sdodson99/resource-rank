import React from 'react';
import FeatureListing from './FeatureListing';

export default {
  component: FeatureListing,
  title: 'Components/FeatureListing',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <FeatureListing {...args} />;

export const Default = Template.bind({});
Default.args = {
  features: [
    {
      title: 'Instant',
      description: 'Super fast!',
      imageSrc: '/img/instantly-find.svg',
    },
    {
      title: 'Explore',
      description: 'Explore!',
      imageSrc: '/img/explore.svg',
    },
    {
      title: 'Rate',
      description: 'Rate!',
      imageSrc: '/img/rate-resources.svg',
    },
  ],
};

export const Single = Template.bind({});
Single.args = {
  features: [
    {
      title: 'Instant',
      description: 'Super fast!',
      imageSrc: '/img/instantly-find.svg',
    },
  ],
};

export const Empty = Template.bind({});
Empty.args = {};
