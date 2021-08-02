import React from 'react';
import RatingStarGroup from './RatingStarGroup';

export default {
  component: RatingStarGroup,
  title: 'Components/RatingStars/RatingStarGroup',
  args: {
    starSize: 50,
  },
};

const Template = (args) => <RatingStarGroup {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Size = Template.bind({});
Size.args = {
  starSize: 100,
};

export const MaxRating = Template.bind({});
MaxRating.args = {
  maxRating: 12,
};

export const EmptyRating = Template.bind({});
EmptyRating.args = {
  rating: 0,
};

export const HalfRating = Template.bind({});
HalfRating.args = {
  rating: 2.5,
};

export const FullRating = Template.bind({});
FullRating.args = {
  rating: 5,
};
