import React from 'react';
import RatingStarGroup from './RatingStarGroup';

export default {
  component: RatingStarGroup,
  title: 'Components/RatingStars/RatingStarGroup',
};

const Template = (args) => <RatingStarGroup {...args} />;

export const Default = Template.bind({});
Default.args = {};
