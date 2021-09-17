import createRatingMutation from '@/graphql/mutations/create-rating-mutation';
import createResourceMutation from '@/graphql/mutations/create-resource-mutation';
import createTopicMutation from '@/graphql/mutations/create-topic-mutation';
import createTopicResourceMutation from '@/graphql/mutations/create-topic-resource-mutation';
import updateRatingMutation from '@/graphql/mutations/update-rating-mutation';
import availableTopicResourcesQuery from '@/graphql/queries/available-topic-resources-query';
import readOnlyModeEnabledQuery from '@/graphql/queries/read-only-mode-enabled-query';
import topicBySlugQuery from '@/graphql/queries/topic-by-slug-query';
import topicResourceBySlugQuery from '@/graphql/queries/topic-resource-by-slug-query';
import topicResourcesQuery from '@/graphql/queries/topic-resources-query';
import topicsQuery from '@/graphql/queries/topics-query';
import userRatingQuery from '@/graphql/queries/user-rating-query';

export default {
  [topicsQuery]: () => ({
    topics: {
      items: [
        {
          id: '1',
          name: 'C#',
          slug: 'csharp',
          verified: true,
        },
        {
          id: '2',
          name: 'JavaScript',
          slug: 'javascript',
          verified: false,
        },
        {
          id: '3',
          name: 'Python',
          slug: 'python',
          verified: false,
        },
        {
          id: '4',
          name: 'Java',
          slug: 'java',
          verified: true,
        },
        {
          id: '5',
          name: 'TypeScript',
          slug: 'typescript',
          verified: true,
        },
      ],
      totalCount: 15,
    },
  }),
  [topicBySlugQuery]: () => ({
    topicBySlug: {
      id: '1',
      name: 'C#',
      slug: 'csharp',
      verified: true,
      createdBy: {
        username: 'Admin',
      },
    },
  }),
  [topicResourcesQuery]: () => ({
    topicResources: {
      items: [
        {
          resource: {
            id: '1',
            name: 'YouTube',
            slug: 'youtube',
            verified: true,
          },
          ratingList: {
            average: 3,
          },
        },
        {
          resource: {
            id: '2',
            name: 'Book',
            slug: 'book',
            verified: false,
          },
          ratingList: {
            average: 5,
          },
        },
        {
          resource: {
            id: '3',
            name: 'Blog Post',
            slug: 'blog-post',
            verified: true,
          },
          ratingList: {
            average: 0,
          },
        },
      ],
      totalCount: 15,
    },
  }),
  [topicResourceBySlugQuery]: () => ({
    topicResourceBySlug: {
      topic: { id: '1', name: 'C#' },
      resource: {
        id: '1',
        name: 'YouTube',
        link: 'youtube.com',
        verified: true,
        createdBy: {
          username: 'Admin',
        },
      },
      ratingList: { count: 5, sum: 14 },
    },
  }),
  [userRatingQuery]: () => ({
    userRating: {
      id: '1',
      value: 4,
    },
  }),
  [availableTopicResourcesQuery]: () => ({
    availableResources: {
      items: [
        {
          resource: {
            id: '1',
            name: 'YouTube',
            slug: 'youtube',
            verified: true,
          },
          alreadyAdded: false,
        },
        {
          resource: {
            id: '2',
            name: 'Book',
            slug: 'book',
            verified: true,
          },
          alreadyAdded: false,
        },
        {
          resource: {
            id: '3',
            name: 'Blog Post',
            slug: 'blog-post',
            verified: false,
          },
          alreadyAdded: true,
        },
      ],
      totalCount: 10,
    },
  }),
  [createTopicMutation]: () => ({
    createTopic: {
      id: '1',
      name: 'C#',
      slug: 'csharp',
    },
  }),
  [createTopicResourceMutation]: () => ({
    createTopicResource: true,
  }),
  [createResourceMutation]: () => ({
    createResource: {
      id: '1',
      slug: 'youtube',
    },
  }),
  [createRatingMutation]: () => ({
    createRating: {
      id: '1',
      value: 3,
    },
  }),
  [updateRatingMutation]: () => ({
    updateRating: true,
  }),
  [readOnlyModeEnabledQuery]: () => ({
    readOnlyModeEnabled: false,
  }),
};
