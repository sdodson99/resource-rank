import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import RatingStarGroup from '@/components/RatingStars/RatingStarGroup/RatingStarGroup';
import SelectableRatingStarGroup from '@/components/RatingStars/SelectableRatingStarGroup/SelectableRatingStarGroup';
import useAuthenticationContext from '@/hooks/use-authentication-context';
import useTopicResourceUserRatingQuery from '@/hooks/queries/use-topic-resource-user-rating-query';
import LoadingErrorEmptyDataLayout from '@/components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { NextSeo } from 'next-seo';
import getTopicResourceBySlug from '@/services/topic-resources/graphql-topic-resource-by-slug-service';
import useRatingSubmitter from '@/hooks/ratings/use-rating-submitter';

const TopicResourceDetails = ({
  topicId,
  resourceId,
  topicSlug,
  resourceSlug,
  topicResource,
}) => {
  const { isLoggedIn } = useAuthenticationContext();

  const [ratingSum, setRatingSum] = useState(topicResource?.ratingList?.sum);
  const [ratingCount, setRatingCount] = useState(
    topicResource?.ratingList?.count
  );

  const [existingRating, setExistingRating] = useState();
  const [selectedRatingValue, setSelectedRatingValue] = useState();
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

  const { submitRating: executeSubmitRating, isSubmittingRating } =
    useRatingSubmitter(topicId, resourceId, existingRating);
  const [submitRatingError, setSubmitRatingError] = useState();

  const submitRating = async () => {
    setSubmitRatingError(null);

    try {
      const submittedRating = await executeSubmitRating(selectedRatingValue);

      if (!existingRating) {
        setRatingCount(ratingCount + 1);
      }

      const existingRatingValue = existingRating?.value ?? 0;
      const ratingChange = selectedRatingValue - existingRatingValue;
      setRatingSum(ratingSum + ratingChange);

      setExistingRating(submittedRating);
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
  const resourceCreatedBy =
    topicResource?.resource?.createdBy?.username ?? 'Unknown';
  const ratingAverage = ratingSum / ratingCount;
  const ratingChanged = selectedRatingValue !== existingRating?.value;
  const validRating = selectedRatingValue > 0;
  const canSubmitRating = ratingChanged && validRating;
  const ratingTitle = hasExistingRating ? 'Update Rating' : 'Add Rating';

  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
    {
      to: `/topics/${topicSlug}`,
      title: topicName,
    },
    {
      to: `/topics/${topicSlug}/resources/${resourceSlug}`,
      title: resourceName,
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <NextSeo
        title={resourceName}
        openGraph={{
          title: `${resourceName} - Resource Rank`,
          description: `Learn about ${resourceName} and See how effective ${resourceName} is for learning ${topicName}.`,
        }}
      />

      <div className="sm:flex justify-between items-center">
        <div className="text-4xl">{resourceName}</div>
        <div className="mt-3 sm:mt-0">
          <RatingStarGroup rating={ratingAverage} starSize={25} />
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-800">
        Created by {resourceCreatedBy}
      </div>

      <div className="mt-10">
        <div className="text-2xl">Details</div>

        <div className="mt-4 flex">
          <div>Link:</div>
          <div className="ml-4">
            {resourceLink && (
              <a
                className="hyperlink break-all"
                href={resourceLink}
                target="_blank"
                rel="noreferrer"
              >
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
            <LoadingErrorEmptyDataLayout
              isLoading={isLoadingUserRating}
              loadingDisplay={
                <div className="text-center">
                  <LoadingSpinner />
                </div>
              }
              hasError={!!userRatingLoadError}
              errorDisplay={
                <div className="error-text">
                  Failed to load your rating for this topic resource.
                </div>
              }
              dataDisplay={
                <div>
                  <SelectableRatingStarGroup
                    rating={selectedRatingValue}
                    onRatingChanged={onSelectedRatingValueChanged}
                    starSize={40}
                  />

                  <div className="mt-6 flex items-center">
                    <button
                      className="btn btn-primary"
                      onClick={submitRating}
                      type="button"
                      disabled={!canSubmitRating}
                    >
                      Submit
                    </button>

                    {isSubmittingRating && (
                      <div className="ml-4">
                        <LoadingSpinner size={25} />
                      </div>
                    )}
                  </div>

                  {submitRatingError && (
                    <div className="mt-4 error-text">
                      Failed to submit rating.
                    </div>
                  )}
                </div>
              }
            />
          )}
        </div>
      </div>
    </BreadcrumbLayout>
  );
};

TopicResourceDetails.propTypes = {
  topicId: PropTypes.string,
  resourceId: PropTypes.string,
  topicSlug: PropTypes.string,
  resourceSlug: PropTypes.string,
  topicResource: PropTypes.object,
};

export async function getServerSideProps({
  req,
  params: { topicSlug, resourceSlug },
}) {
  try {
    const topicResource = await getTopicResourceBySlug(topicSlug, resourceSlug);

    return {
      props: {
        topicId: topicResource.topic.id,
        resourceId: topicResource.resource.id,
        topicSlug,
        resourceSlug,
        topicResource,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default TopicResourceDetails;
