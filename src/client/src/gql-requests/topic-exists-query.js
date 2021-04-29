import { gql } from '@apollo/client';

export default gql`
  query TopicExists($name: String!) {
    topicExists(name: $name)
  }
`;
