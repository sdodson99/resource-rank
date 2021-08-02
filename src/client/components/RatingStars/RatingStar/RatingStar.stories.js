import React from 'react';
import RatingStar from './RatingStar';

export default {
  component: RatingStar,
  title: 'Components/RatingStars/RatingStar',
  args: {
    size: 50,
  },
};

const Template = (args) => <RatingStar {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Color = Template.bind({});
Color.args = {
  color: 'orange',
  fill: 1,
};

export const Size = Template.bind({});
Size.args = {
  ...Color.args,
  size: 100,
  fill: 1,
};

export const Empty = Template.bind({});
Empty.args = {
  ...Color.args,
  fill: 0,
};

export const Half = Template.bind({});
Half.args = {
  ...Color.args,
  fill: 0.5,
};

export const Full = Template.bind({});
Full.args = {
  ...Color.args,
  fill: 1,
};
