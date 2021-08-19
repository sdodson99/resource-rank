import React from 'react';
import Footer from './Footer';

export default {
  component: Footer,
  title: 'Components/Footer',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {};
