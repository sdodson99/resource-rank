import { gql } from '@apollo/client';

export default gql`
  mutation CreateResource($name: String!, $link: String!) {
    createResource(name: $name, link: $link) {
      id
    }
  }
`;
