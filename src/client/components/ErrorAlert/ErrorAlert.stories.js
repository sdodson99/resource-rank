import React from 'react';
import ErrorAlert from './ErrorAlert';

export default {
  component: ErrorAlert,
  title: 'Components/ErrorAlert',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <ErrorAlert {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Something went wrong.',
};

export const Border = Template.bind({});
Border.args = {
  ...Default.args,
  border: true,
};
