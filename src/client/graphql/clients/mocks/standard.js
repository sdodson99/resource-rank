import topicsQuery from '@/graphql/queries/topics-query';

export default {
  [topicsQuery]: () => ({
    data: 'success',
  }),
};
