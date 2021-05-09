import { useApolloClient } from '@apollo/client';
import topicExistsQuery from '../gql-requests/topic-exists-query';

export default function useAvailableTopicNameValidator() {
  const apolloClient = useApolloClient();

  const validateIsAvailableTopicName = async (nameInput) => {
    const result = await apolloClient.query({
      query: topicExistsQuery,
      variables: {
        name: nameInput,
      },
    });

    const topicNameExists = result.data?.topicExists ?? false;

    return !topicNameExists;
  };

  return validateIsAvailableTopicName;
}
