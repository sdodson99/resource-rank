import React from 'react';
import EmptyRatingStar from './EmptyRatingStar';

export default {
  component: EmptyRatingStar,
  title: 'Components/RatingStars/EmptyRatingStar',
  args: {
    size: 50,
  },
};

const Template = (args) => <EmptyRatingStar {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Size = Template.bind({});
Size.args = {
  size: 100,
};
