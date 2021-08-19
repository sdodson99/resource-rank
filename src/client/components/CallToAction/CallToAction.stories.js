import React from 'react';
import CallToAction from './CallToAction';

export default {
  component: CallToAction,
  title: 'Components/CallToAction',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <CallToAction {...args} />;

export const Default = Template.bind({});
Default.args = {};
