import React from 'react';
import Listing from './Listing';

export default {
  component: Listing,
  title: 'Components/Listing',
};

const Template = (args) => <Listing {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: [
    <div key="1">Child 1</div>,
    <div key="2">Child 2</div>,
    <div key="3">Child 3</div>,
  ],
};

export const Single = Template.bind({});
Single.args = {
  children: [<div key="1">Child 1</div>],
};

export const Empty = Template.bind({});
Empty.args = {
  children: [],
};
