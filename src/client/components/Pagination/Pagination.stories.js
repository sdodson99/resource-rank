import React from 'react';
import Pagination from './Pagination';

export default {
  component: Pagination,
  title: 'Components/Pagination',
};

const Template = (args) => <Pagination {...args} />;

export const Default = Template.bind({});
Default.args = {
  pageCount: 5,
};

export const OnePage = Template.bind({});
OnePage.args = {
  pageCount: 1,
};

export const ManyPages = Template.bind({});
ManyPages.args = {
  pageCount: 20,
};

export const MiddleSelection = Template.bind({});
MiddleSelection.args = {
  selectedPage: 8,
  pageCount: 20,
};

export const SelectedPageRange = Template.bind({});
SelectedPageRange.args = {
  selectedPage: 10,
  pageCount: 20,
  selectedPageRange: 0,
};

export const SelectedPageGapRange = Template.bind({});
SelectedPageGapRange.args = {
  selectedPage: 5,
  pageCount: 10,
  selectedPageRange: 3,
  selectedPageGapMinRange: 5,
};
