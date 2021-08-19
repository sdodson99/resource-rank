import React from 'react';
import BreadcrumbLayout from './BreadcrumbLayout';

export default {
  component: BreadcrumbLayout,
  title: 'Components/BreadcrumbLayout',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <BreadcrumbLayout {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: <div>Hello world!</div>,
  breadcrumbs: [
    {
      to: '/',
      title: 'Home',
    },
    {
      to: '',
      title: 'Current',
    },
  ],
};

export const Single = Template.bind({});
Single.args = {
  children: <div>Hello world!</div>,
  breadcrumbs: [
    {
      to: '',
      title: 'Current',
    },
  ],
};
