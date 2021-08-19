import React from 'react';
import Header from './Header';

export default {
  component: Header,
  title: 'Components/Header',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {};
