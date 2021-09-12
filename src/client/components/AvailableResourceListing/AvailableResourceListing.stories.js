import React from 'react';
import AvailableResourceListing from './AvailableResourceListing';

export default {
  component: AvailableResourceListing,
  title: 'Components/AvailableResourceListing',
};

const Template = (args) => <AvailableResourceListing {...args} />;

export const Default = Template.bind({});
Default.args = {
  resources: [
    {
      name: 'Resource 1',
      alreadyAdded: false,
      hasAddError: false,
      isAdding: true,
    },
    {
      name: 'Resource 2',
      alreadyAdded: true,
      hasAddError: false,
    },
    {
      name: 'Resource 3',
      alreadyAdded: false,
      hasAddError: true,
      verified: true,
      disableAdd: true,
    },
  ],
};

export const Single = Template.bind({});
Single.args = {
  resources: [
    {
      name: 'Resource 1',
      alreadyAdded: false,
      hasAddError: false,
    },
  ],
};

export const Empty = Template.bind({});
Empty.args = {
  resources: [],
};
