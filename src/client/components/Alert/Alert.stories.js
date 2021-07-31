import React from 'react';
import Alert from './Alert';
import { Info } from '@material-ui/icons';

export default {
  component: Alert,
  title: 'Components/Alert',
};

const Template = (args) => <Alert {...args}>This is an alert!</Alert>;

export const Default = Template.bind({});
Default.args = {};

export const Icon = Template.bind({});
Icon.args = {
  icon: <Info htmlColor="red" />,
};

export const Custom = Template.bind({});
Custom.args = {
  border: true,
  className: 'bg-blue-50 border-blue-100 text-blue-800',
  icon: <Info color="primary" />,
};
Custom.displayName = 'Custom';
