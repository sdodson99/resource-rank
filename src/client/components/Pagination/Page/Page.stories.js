import React from 'react';
import Page from './Page';

export default {
  component: Page,
  title: 'Components/Pagination/Page',
};

const Template = (args) => <Page {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Number = Template.bind({});
Number.args = {
  number: 3,
};

export const Selected = Template.bind({});
Selected.args = {
  number: 3,
  isSelected: true,
};
