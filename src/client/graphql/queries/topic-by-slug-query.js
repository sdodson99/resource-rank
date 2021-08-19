import { gql } from 'graphql-request';

const topicBySlugQuery = gql`
  query TopicBySlug($slug: String!) {
    topicBySlug(slug: $slug) {
      id
      name
      slug
      verified
      createdBy {
        username
      }
    }
  }
`;

export default topicBySlugQuery;
