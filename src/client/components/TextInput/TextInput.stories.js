import React from 'react';
import TextInput from './TextInput';

export default {
  component: TextInput,
  title: 'Components/TextInput',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Error = Template.bind({});
Error.args = {
  errorMessage: 'Please enter information.',
};
