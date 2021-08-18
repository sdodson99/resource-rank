import React from 'react';
import Hero from './Hero';

export default {
  component: Hero,
  title: 'Components/Hero',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <Hero {...args} />;

export const Default = Template.bind({});
Default.args = {};
