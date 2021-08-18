import React from 'react';
import PageHeaderButton from './PageHeaderButton';

export default {
  component: PageHeaderButton,
  title: 'Components/PageHeaderButton',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <PageHeaderButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Page Title',
  buttonContent: 'New',
};

export const HideButton = Template.bind({});
HideButton.args = {
  ...Default.args,
  hideButton: true,
};

export const TitleStyle = Template.bind({});
TitleStyle.args = {
  ...Default.args,
  titleClassName: 'text-xl text-blue-500',
};
