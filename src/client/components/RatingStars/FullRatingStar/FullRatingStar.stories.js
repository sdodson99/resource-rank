import React from 'react';
import FullRatingStar from './FullRatingStar';

export default {
  component: FullRatingStar,
  title: 'Components/RatingStars/FullRatingStar',
};

const Template = (args) => <FullRatingStar {...args} />;

export const Default = Template.bind({});
Default.args = {};
