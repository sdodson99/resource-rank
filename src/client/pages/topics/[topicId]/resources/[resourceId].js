import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '../../../../components/BreadcrumbLayout/BreadcrumbLayout';
import { createGraphQLFetcher } from '../../../../services/graphql-fetchers/graphql-fetcher-factory';
import getTopicResourceByIdQuery from '../../../../gql-requests/get-topic-resource-by-id-query';
import Head from 'next/head';
import RatingStars from '../../../../components/RatingStars/rating-stars';
import useAuthenticationContext from '../../../../hooks/authentication/use-authentication-context';
import useTopicResourceUserRatingQuery from '../../../../hooks/use-topic-resource-user-rating-query';
import SelectableRatingStars from '../../../../components/RatingStars/selectable-rating-stars';

const TopicResourceDetails = ({ topicId, resourceId, topicResource }) => {
  const { isLoggedIn } = useAuthenticationContext();

  const [selectedRating, setSelectedRating] = useState();

  const {
    execute: executeGetUserRatingQuery,
    data: userRatingData,
    error: userRatingLoadError,
    isLoading: isLoadingUserRating,
  } = useTopicResourceUserRatingQuery(topicId, resourceId);

  useEffect(async () => {
    if (isLoggedIn) {
      await executeGetUserRatingQuery();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    console.log(userRatingData);
  }, [userRatingData]);

  const submitRating = () => {
    console.log(selectedRating);
  };

  const topicName = topicResource?.topic?.name;
  const resourceName = topicResource?.resource?.name;
  const resourceLink = topicResource?.resource?.link;
  const rating = topicResource?.ratingList?.average;

  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
    {
      to: `/topics/${topicId}`,
      title: topicName,
    },
    {
      to: `/topics/${topicId}/resources/${resourceId}`,
      title: resourceName,
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>{resourceName} - Resource Rank</title>
      </Head>

      <div className="sm:flex justify-between items-center">
        <div className="text-4xl">{resourceName}</div>
        <div className="mt-3 sm:mt-0">
          <RatingStars rating={rating} />
        </div>
      </div>

      <div className="mt-10">
        <div className="text-2xl">Details</div>

        <div className="mt-4 flex">
          <div>Link:</div>
          <div className="ml-4">
            <a href={resourceLink} target="_blank" rel="noreferrer">
              {resourceLink}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-2xl">Add Rating</div>

        <div className="mt-4">
          {!isLoggedIn && <div>You must login to add a rating.</div>}

          {isLoggedIn && (
            <div>
              <SelectableRatingStars
                selectedRating={selectedRating}
                selectedRatingChanged={setSelectedRating}
                starWidth={25}
              />
              <div className="mt-6">
                <button
                  className="btn btn-primary"
                  onClick={submitRating}
                  type="button"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BreadcrumbLayout>
  );
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
