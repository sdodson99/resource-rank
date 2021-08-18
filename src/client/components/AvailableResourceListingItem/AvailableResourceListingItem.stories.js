import React from 'react';
import AvailableResourceListingItem from './AvailableResourceListingItem';

export default {
  component: AvailableResourceListingItem,
  title: 'Components/AvailableResourceListingItem',
};

const Template = (args) => <AvailableResourceListingItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  resource: {
    name: 'Resource 1',
  },
};

export const AlreadyAdded = Template.bind({});
AlreadyAdded.args = {
  resource: {
    name: 'Resource 1',
    alreadyAdded: true,
  },
};

export const Error = Template.bind({});
Error.args = {
  resource: {
    name: 'Resource 1',
    hasAddError: true,
  },
};
