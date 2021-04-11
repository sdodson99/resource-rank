import { gql } from '@apollo/client';

class TopicProvider {
  constructor(apolloClient) {
    this.apolloClient = apolloClient;
  }

  async getTopics() {
    const response = await this.apolloClient.query({
      query: gql`
        {
          topics {
            id
            name
          }
        }
      `,
    });

    const { data } = response;

    if (!data) {
      return [];
    }

    const { topics } = data;

    return topics;
  }
}

export default TopicProvider;
