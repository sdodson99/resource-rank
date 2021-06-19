import { useApolloClient } from '@apollo/client';
import topicExistsQuery from '../gql-requests/topic-exists-query';

export default function useAvailableTopicNameValidator() {
  const apolloClient = useApolloClient();

  const validateIsAvailableTopicName = async (nameInput) => {
    const { data } = await apolloClient.query({
      query: topicExistsQuery,
      variables: {
        name: nameInput,
      },
    });

    const topicNameExists = data?.topicExists ?? false;

    return !topicNameExists;
  };

  return validateIsAvailableTopicName;
}
