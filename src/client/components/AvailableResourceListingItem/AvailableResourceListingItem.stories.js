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

export const Verified = Template.bind({});
Verified.args = {
  resource: {
    name: 'Resource 1',
    verified: true,
  },
};

export const AlreadyAdded = Template.bind({});
AlreadyAdded.args = {
  resource: {
    name: 'Resource 1',
    alreadyAdded: true,
  },
};

export const VerifiedAlreadyAdded = Template.bind({});
VerifiedAlreadyAdded.args = {
  resource: {
    name: 'Resource 1',
    alreadyAdded: true,
    verified: true,
  },
};

export const DisableAdd = Template.bind({});
DisableAdd.args = {
  resource: {
    name: 'Resource 1',
    disableAdd: true,
  },
};

export const IsAdding = Template.bind({});
IsAdding.args = {
  resource: {
    name: 'Resource 1',
    isAdding: true,
  },
};

export const Error = Template.bind({});
Error.args = {
  resource: {
    name: 'Resource 1',
    hasAddError: true,
  },
};
