import { gql } from 'graphql-request';

const topicResourceBySlugQuery = gql`
  query TopicResourceBySlugQuery($topicSlug: String!, $resourceSlug: String!) {
    topicResourceBySlug(topicSlug: $topicSlug, resourceSlug: $resourceSlug) {
      topic {
        id
        name
      }
      resource {
        id
        name
        link
        createdBy {
          username
        }
      }
      ratingList {
        count
        sum
      }
    }
  }
`;

export default topicResourceBySlugQuery;
