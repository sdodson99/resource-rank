import React from 'react';
import HalfRatingStar from './HalfRatingStar';

export default {
  component: HalfRatingStar,
  title: 'Components/RatingStars/HalfRatingStar',
  args: {
    size: 50,
  },
};

const Template = (args) => <HalfRatingStar {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Color = Template.bind({});
Color.args = {
  color: 'orange',
};

export const Size = Template.bind({});
Size.args = {
  ...Color.args,
  size: 100,
};
