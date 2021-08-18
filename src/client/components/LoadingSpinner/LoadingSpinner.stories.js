import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export default {
  component: LoadingSpinner,
  title: 'Components/LoadingSpinner',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <LoadingSpinner {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Size = Template.bind({});
Size.args = {
  size: 300,
};

export const Color = Template.bind({});
Color.args = {
  size: 100,
  color: 'red',
};
