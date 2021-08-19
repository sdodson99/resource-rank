import React from 'react';
import InfoAlert from './InfoAlert';

export default {
  component: InfoAlert,
  title: 'Components/Alerts/InfoAlert',
};

const Template = (args) => <InfoAlert {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Successfully updated information.',
};

export const Border = Template.bind({});
Border.args = {
  ...Default.args,
  border: true,
};
