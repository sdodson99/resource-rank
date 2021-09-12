import React from 'react';
import LoadingButton from './LoadingButton';

export default {
  component: LoadingButton,
  title: 'Components/LoadingButton',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <LoadingButton {...args} />;

export const NotLoading = Template.bind({});
NotLoading.args = {
  children: 'Login',
};

export const Loading = Template.bind({});
Loading.args = {
  children: 'Login',
  isLoading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Login',
  disabled: true,
};
