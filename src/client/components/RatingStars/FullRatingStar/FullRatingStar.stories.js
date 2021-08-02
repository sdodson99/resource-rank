import React from 'react';
import FullRatingStar from './FullRatingStar';

export default {
  component: FullRatingStar,
  title: 'Components/RatingStars/FullRatingStar',
  args: {
    size: 50,
  },
};

const Template = (args) => <FullRatingStar {...args} />;

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
