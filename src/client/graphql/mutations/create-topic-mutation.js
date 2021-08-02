import { gql } from 'graphql-request';

const createTopicMutation = gql`
  mutation CreateTopic($name: String!) {
    createTopic(name: $name) {
      id
      name
      slug
    }
  }
`;

export default createTopicMutation;
