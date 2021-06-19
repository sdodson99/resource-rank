import { gql } from 'graphql-request';

export default gql`
  query TopicExists($name: String!) {
    topicExists(name: $name)
  }
`;
