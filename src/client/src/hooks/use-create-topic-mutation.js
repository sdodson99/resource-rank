import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import getTopicsQuery from '../gql-requests/get-topics-query';
import createTopicMutation from '../gql-requests/create-topic-mutation';

export default () => {
  const [executeCreateTopic] = useMutation(createTopicMutation, {
    update: (cache, { data }) => {
      const { createTopic } = data;

      const query = cache.readQuery({ query: getTopicsQuery });
      if (query) {
        const { topics } = query;

        cache.writeQuery({
          query: getTopicsQuery,
          data: { topics: [...topics, createTopic] },
        });
      }
    },
  });

  const createTopic = useCallback(async (name) => {
    await executeCreateTopic({ variables: { name } });
  });

  return createTopic;
};
