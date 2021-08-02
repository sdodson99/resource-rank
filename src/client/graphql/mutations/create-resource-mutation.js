import { gql } from 'graphql-request';

const createResourceMutation = gql`
  mutation CreateResource($name: String!, $link: String!) {
    createResource(name: $name, link: $link) {
      id
      slug
    }
  }
`;

export default createResourceMutation;
