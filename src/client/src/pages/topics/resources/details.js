import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Layout from '../../../components/layout/layout';
import BreadcrumbListing from '../../../components/breadcrumb-listing/breadcrumb-listing';
import useTopicName from '../../../hooks/use-topic-name';
import { useMutation, useQuery } from '@apollo/client';
import getTopicResourceByIdQuery from '../../../gql-requests/get-topic-resource-by-id-query';
import RatingStars from '../../../components/rating-stars/rating-stars';
import SelectableRatingStars from '../../../components/rating-stars/selectable-rating-stars';
import getUserRatingQuery from '../../../gql-requests/get-user-rating-query';
import createRatingMutation from '../../../gql-requests/create-rating-mutation';

function TopicResourceDetails({ topicId, resourceId }) {
  const {
    data: topicResourceData,
    loading: topicResourceLoading,
    error: topicResourceError,
    refetch: refetchTopicResourceData,
  } = useQuery(getTopicResourceByIdQuery, {
    variables: {
      topicId,
      resourceId,
    },
  });

  const resourceName =
    topicResourceData?.topicResource?.resource?.name ?? 'Resource Details';
  const resourceLink = topicResourceData?.topicResource?.resource?.link;
  const averageRating = topicResourceData?.topicResource?.ratingList?.average;

  const [existingRating, setExistingRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const { loading: userRatingLoading } = useQuery(getUserRatingQuery, {
    variables: {
      topicId,
      resourceId,
    },
    onCompleted: (data) => {
      const userRatingValue = data?.userRating?.value;

      setSelectedRating(userRatingValue);
      setExistingRating(userRatingValue);
    },
  });

  const hasExistingUserRating = existingRating > 0;

  const ratingChanged = selectedRating !== existingRating;
  const validRating = selectedRating > 0;
  const canSubmitRating = ratingChanged && validRating;

  const [createRating] = useMutation(createRatingMutation, {
    variables: {
      topicId,
      resourceId,
      value: selectedRating,
    },
  });

  const submitRating = async () => {
    if (!hasExistingUserRating) {
      await createRating();
    } else {
    }

    setExistingRating(selectedRating);
    await refetchTopicResourceData();
  };

  const topicName = useTopicName(topicId);

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
    {
      to: `/topics/${topicId}`,
      title: topicName ?? 'Topic Details',
    },
    {
      to: `/topics/${topicId}/resources/${resourceId}`,
      title: resourceName,
    },
  ];

  const ratingTitle = hasExistingUserRating ? 'Update Rating' : 'Add Rating';

  return (
    <Layout>
      <BreadcrumbListing breadcrumbs={breadcrumbs} />

      <div className="mt-4">
        {topicResourceLoading && (
          <div className="text-center">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!topicResourceLoading && (
          <div className="text-center text-sm-start">
            {topicResourceError && <div>Failed to load topic resource.</div>}

            {!topicResourceError && (
              <div>
                <div className="row align-items-center">
                  <div className="col-sm">
                    <div className="page-header">{resourceName}</div>
                  </div>
                  <div className="col-sm-auto">
                    <RatingStars rating={averageRating} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="fs-2">Details</div>
                  <div className="mt-4 row align-items-center">
                    <div className="col-sm-auto">Link:</div>
                    <div className="col-sm-auto mt-2 mt-sm-0">
                      {resourceLink && (
                        <a href={resourceLink} target="_blank" rel="noreferrer">
                          {resourceLink}
                        </a>
                      )}
                      {!resourceLink && <div>No resource link added.</div>}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  {userRatingLoading && (
                    <div className="text-center">
                      <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                  {!userRatingLoading && (
                    <div>
                      <div className="fs-2">{ratingTitle}</div>
                      <div className="mt-4 d-inline-block">
                        <SelectableRatingStars
                          selectedRating={selectedRating}
                          selectedRatingChanged={(r) => setSelectedRating(r)}
                          starWidth={50}
                        />
                      </div>
                      <div className="mt-5">
                        <button
                          className="btn btn-primary"
                          disabled={!canSubmitRating}
                          onClick={submitRating}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

TopicResourceDetails.propTypes = {
  topicId: PropTypes.string,
  resourceId: PropTypes.string,
};

export default TopicResourceDetails;
