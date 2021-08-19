import { gql } from 'graphql-request';

const topicResourceBySlugQuery = gql`
  query TopicResourceBySlug($topicSlug: String!, $resourceSlug: String!) {
    topicResourceBySlug(topicSlug: $topicSlug, resourceSlug: $resourceSlug) {
      topic {
        id
        name
      }
      resource {
        id
        name
        link
        verified
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
