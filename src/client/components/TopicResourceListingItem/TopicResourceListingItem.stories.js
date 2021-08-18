import React from 'react';
import TopicResourceListingItem from './TopicResourceListingItem';

export default {
  component: TopicResourceListingItem,
  title: 'Components/TopicResourceListingItem',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <TopicResourceListingItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  topicId: '1',
  resourceId: '1',
  topicSlug: 'topic-1',
  resourceSlug: 'resource-1',
  name: 'Resource 1',
  rating: 5,
};

export const Verified = Template.bind({});
Verified.args = {
  ...Default.args,
  verified: true,
};
