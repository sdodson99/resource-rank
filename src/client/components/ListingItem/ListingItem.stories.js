import React from 'react';
import ListingItem from './ListingItem';

export default {
  component: ListingItem,
  title: 'Components/ListingItem',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <ListingItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Listing item content.',
};

export const Hover = Template.bind({});
Hover.args = {
  ...Default.args,
  hover: true,
};
