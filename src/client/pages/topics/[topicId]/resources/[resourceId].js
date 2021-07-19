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
import useCreateRatingMutation from '../../../../hooks/use-create-rating-mutation';
import useUpdateRatingMutation from '../../../../hooks/use-update-rating-mutation';

const TopicResourceDetails = ({ topicId, resourceId, topicResource }) => {
  const { isLoggedIn } = useAuthenticationContext();

  const [existingRating, setExistingRating] = useState();
  const [selectedRatingValue, setSelectedRatingValue] = useState();
  const [submitRatingError, setSubmitRatingError] = useState();
  const hasExistingRating = !!existingRating;

  const {
    execute: executeGetUserRatingQuery,
    data: userRatingData,
    error: userRatingLoadError,
    isLoading: isLoadingUserRating,
  } = useTopicResourceUserRatingQuery(topicId, resourceId);

  useEffect(async () => {
    if (isLoggedIn) {
      await executeGetUserRatingQuery();
    } else {
      setExistingRating(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const rating = userRatingData?.userRating;
    setExistingRating(rating);

    const ratingValue = rating?.value;
    setSelectedRatingValue(ratingValue);
  }, [userRatingData]);

  const { execute: executeCreateRatingMutation, isLoading: isCreatingRating } =
    useCreateRatingMutation(topicId, resourceId);

  const createRating = async () => {
    await executeCreateRatingMutation(selectedRatingValue);
  };

  const { execute: executeUpdateRatingMutation, isLoading: isUpdatingRating } =
    useUpdateRatingMutation();

  const updateRating = async () => {
    const ratingId = existingRating?.id;

    await executeUpdateRatingMutation(ratingId, selectedRatingValue);
  };

  const submitRating = async () => {
    setSubmitRatingError(null);

    try {
      if (!hasExistingRating) {
        await createRating();
      } else {
        await updateRating();
      }
    } catch (error) {
      setSubmitRatingError(error);
    }
  };

  const onSelectedRatingValueChanged = (r) => {
    setSubmitRatingError(null);
    setSelectedRatingValue(r);
  };

  const topicName = topicResource?.topic?.name;
  const resourceName = topicResource?.resource?.name;
  const resourceLink = topicResource?.resource?.link;
  const rating = topicResource?.ratingList?.average;
  const ratingChanged = selectedRatingValue !== existingRating?.value;
  const validRating = selectedRatingValue > 0;
  const canSubmitRating = ratingChanged && validRating;
  const isSubmittingRating = isUpdatingRating || isCreatingRating;
  const ratingTitle = hasExistingRating ? 'Update Rating' : 'Add Rating';

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
            {resourceLink && (
              <a href={resourceLink} target="_blank" rel="noreferrer">
                {resourceLink}
              </a>
            )}
            {!resourceLink && 'No resource link added.'}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-2xl">{ratingTitle}</div>

        <div className="mt-4">
          {!isLoggedIn && <div>You must login to add a rating.</div>}

          {isLoggedIn && (
            <div>
              <SelectableRatingStars
                selectedRating={selectedRatingValue}
                selectedRatingChanged={onSelectedRatingValueChanged}
                starWidth={25}
              />
              <div className="mt-6">
                <button
                  className="btn btn-primary"
                  onClick={submitRating}
                  type="button"
                  disabled={!canSubmitRating}
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
