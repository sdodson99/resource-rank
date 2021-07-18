import React from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '../../../../components/BreadcrumbLayout/BreadcrumbLayout';
import { createGraphQLFetcher } from '../../../../services/graphql-fetchers/graphql-fetcher-factory';
import getTopicResourceByIdQuery from '../../../../gql-requests/get-topic-resource-by-id-query';

const TopicResourceDetails = ({ topicId, resourceId, topicResource }) => {
  return <BreadcrumbLayout>hello world</BreadcrumbLayout>;
};

TopicResourceDetails.propTypes = {
  topicId: PropTypes.string,
  resourceId: PropTypes.string,
  topicResource: PropTypes.object,
};

export async function getServerSideProps({
  req,
  params: { topicId, resourceId },
}) {
  const graphqlFetcher = createGraphQLFetcher();

  const topicResourceResult = await graphqlFetcher.fetch(
    getTopicResourceByIdQuery,
    {
      topicId,
      resourceId,
    }
  );

  const topicResource = topicResourceResult?.topicResource;

  if (!topicResource) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      topicId,
      resourceId,
      topicResource,
    },
  };
}

export default TopicResourceDetails;
