import React from 'react';
import TopicResourceListing from './TopicResourceListing';

export default {
  component: TopicResourceListing,
  title: 'Components/TopicResourceListing',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <TopicResourceListing {...args} />;

export const Default = Template.bind({});
Default.args = {
  topicId: '1',
  topicSlug: 'topic-1',
  topicResources: [
    {
      resource: {
        id: '1',
        slug: 'resource-1',
        name: 'Resource 1',
        verified: true,
      },
      ratingList: {
        average: 1,
      },
    },
    {
      resource: {
        id: '2',
        slug: 'resource-2',
        name: 'Resource 2',
      },
      ratingList: {
        average: 3,
      },
    },
    {
      resource: {
        id: '3',
        slug: 'resource-3',
        name: 'Resource 3',
      },
      ratingList: {
        average: 5,
      },
    },
  ],
  selectedPage: 3,
  pageCount: 5,
};

export const Single = Template.bind({});
Single.args = {
  topicId: '1',
  topicSlug: 'topic-1',
  topicResources: [
    {
      resource: {
        id: '1',
        slug: 'resource-1',
        name: 'Resource 1',
      },
      ratingList: {
        average: 1,
      },
    },
  ],
};

export const Empty = Template.bind({});
Empty.args = {};
