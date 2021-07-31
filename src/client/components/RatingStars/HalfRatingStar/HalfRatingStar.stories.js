import React from 'react';
import HalfRatingStar from './HalfRatingStar';

export default {
  component: HalfRatingStar,
  title: 'Components/RatingStars/HalfRatingStar',
};

const Template = (args) => <HalfRatingStar {...args} />;

export const Default = Template.bind({});
Default.args = {};
