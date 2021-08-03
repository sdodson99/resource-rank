import React from 'react';
import TemplateName from './TemplateName';

export default {
  component: TemplateName,
  title: 'Components/TemplateName',
};

const Template = (args) => <TemplateName {...args} />;

export const Default = Template.bind({});
Default.args = {};
