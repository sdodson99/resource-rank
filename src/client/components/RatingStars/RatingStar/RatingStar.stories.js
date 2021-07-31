import React from 'react';
import RatingStar from './RatingStar';

export default {
  component: RatingStar,
  title: 'Components/RatingStars/RatingStar',
};

const Template = (args) => <RatingStar {...args} />;

export const Default = Template.bind({});
Default.args = {};
