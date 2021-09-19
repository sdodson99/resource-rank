import React from 'react';
import SkeletonListing from './SkeletonListing';

export default {
  component: SkeletonListing,
  title: 'Components/SkeletonListing',
};

const Template = (args) => <SkeletonListing {...args} />;

export const Default = Template.bind({});
Default.args = {};
