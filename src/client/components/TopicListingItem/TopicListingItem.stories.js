import React from 'react';
import TopicListingItem from './TopicListingItem';

export default {
  component: TopicListingItem,
  title: 'Components/TopicListingItem',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <TopicListingItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Topic 1',
  slug: 'topic-1',
};
