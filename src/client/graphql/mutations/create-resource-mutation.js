import { gql } from 'graphql-request';

export default gql`
  mutation CreateResource($name: String!, $link: String!) {
    createResource(name: $name, link: $link) {
      id
    }
  }
`;
