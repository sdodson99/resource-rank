import React from 'react';
import TopicListing from './TopicListing';

export default {
  component: TopicListing,
  title: 'Components/TopicListing',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <TopicListing {...args} />;

export const Default = Template.bind({});
Default.args = {
  topics: [
    {
      name: 'Topic 1',
      slug: 'topic-1',
    },
    {
      name: 'Topic 2',
      slug: 'topic-2',
      verified: true,
    },
    {
      name: 'Topic 3',
      slug: 'topic-3',
    },
  ],
};

export const Single = Template.bind({});
Single.args = {
  topics: [
    {
      name: 'Topic 1',
      slug: 'topic-1',
    },
  ],
};

export const Empty = Template.bind({});
Empty.args = {};
