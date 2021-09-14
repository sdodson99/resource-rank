import React from 'react';
import PaginatedListing from './PaginatedListing';

export default {
  component: PaginatedListing,
  title: 'Components/PaginatedListing',
};

const Template = (args) => <PaginatedListing {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: [
    <div key="1">Child 1</div>,
    <div key="2">Child 2</div>,
    <div key="3">Child 3</div>,
  ],
};

export const PageCount = Template.bind({});
PageCount.args = {
  ...Default.args,
  pageCount: 5,
};

export const SelectedPage = Template.bind({});
SelectedPage.args = {
  ...Default.args,
  ...PageCount.args,
  selectedPage: 3,
};
