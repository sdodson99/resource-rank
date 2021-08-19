import React from 'react';
import VerifiedIcon from './VerifiedIcon';

export default {
  component: VerifiedIcon,
  title: 'Components/VerifiedIcon',
};

const Template = (args) => <VerifiedIcon {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Size = Template.bind({});
Size.args = {
  size: 50,
};
