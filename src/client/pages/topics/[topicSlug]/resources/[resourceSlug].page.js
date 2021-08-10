import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import RatingStarGroup from '@/components/RatingStars/RatingStarGroup/RatingStarGroup';
import useAuthenticationContext from '@/hooks/use-authentication-context';
import LoadingErrorEmptyDataLayout from '@/components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { NextSeo } from 'next-seo';
import getTopicResourceBySlug from '@/services/topic-resources/graphql-topic-resource-by-slug-service';
import useRatingSubmitter from '@/hooks/ratings/use-rating-submitter';
import useRating from '@/hooks/ratings/use-rating';
import RatingForm from '@/components/RatingForm/RatingForm';
import ResourceDetails from '@/components/ResourceDetails/ResourceDetails';

const TopicResourceDetails = ({
  topicId,
  resourceId,
  topicSlug,
  resourceSlug,
  topicResource,
}) => {
  const [ratingSum, setRatingSum] = useState(topicResource?.ratingList?.sum);
  const [ratingCount, setRatingCount] = useState(
    topicResource?.ratingList?.count
  );

  const { isLoggedIn } = useAuthenticationContext();
  const {
    rating,
    isLoading: isLoadingRating,
    error: ratingError,
  } = useRating(topicId, resourceId, isLoggedIn);

  const [existingRating, setExistingRating] = useState();
  useEffect(() => {
    setExistingRating(rating);
  }, [rating]);

  const { submitRating: executeSubmitRating, isSubmittingRating } =
    useRatingSubmitter(topicId, resourceId, existingRating);
  const [submitRatingError, setSubmitRatingError] = useState();

  const submitRating = async (ratingValue) => {
    setSubmitRatingError(null);

    try {
      const submittedRating = await executeSubmitRating(ratingValue);

      if (!existingRating) {
        setRatingCount(ratingCount + 1);
      }

      const existingRatingValue = existingRating?.value ?? 0;
      const ratingChange = ratingValue - existingRatingValue;
      setRatingSum(ratingSum + ratingChange);

      setExistingRating(submittedRating);
    } catch (error) {
      setSubmitRatingError(error);
    }
  };

  const topicName = topicResource?.topic?.name;
  const resourceName = topicResource?.resource?.name;
  const resourceLink = topicResource?.resource?.link;
  const resourceCreatedBy =
    topicResource?.resource?.createdBy?.username ?? 'Unknown';
  const ratingAverage = ratingSum / ratingCount;
  const ratingTitle = existingRating ? 'Update Rating' : 'Add Rating';

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
    <div data-testid="TopicResourceDetailsPage">
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

          <div className="mt-4">
            <ResourceDetails link={resourceLink} />
          </div>
        </div>

        <div className="mt-8">
          <div className="text-2xl">{ratingTitle}</div>

          <div className="mt-4">
            {!isLoggedIn && <div>You must login to add a rating.</div>}

            {isLoggedIn && (
              <LoadingErrorEmptyDataLayout
                isLoading={isLoadingRating}
                loadingDisplay={
                  <div className="text-center">
                    <LoadingSpinner />
                  </div>
                }
                hasError={!!ratingError}
                errorDisplay={
                  <div className="error-text">
                    Failed to load your rating for this topic resource.
                  </div>
                }
                dataDisplay={
                  <RatingForm
                    onSubmit={submitRating}
                    isSubmittingRating={isSubmittingRating}
                    submitRatingError={submitRatingError}
                    existingRating={existingRating?.value}
                  />
                }
              />
            )}
          </div>
        </div>
      </BreadcrumbLayout>
    </div>
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
