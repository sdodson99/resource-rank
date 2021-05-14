import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useTopicName from '../../../hooks/use-topic-name';
import { useMutation, useQuery } from '@apollo/client';
import getTopicResourceByIdQuery from '../../../gql-requests/get-topic-resource-by-id-query';
import RatingStars from '../../../components/rating-stars/rating-stars';
import SelectableRatingStars from '../../../components/rating-stars/selectable-rating-stars';
import createRatingMutation from '../../../gql-requests/create-rating-mutation';
import updateRatingMutation from '../../../gql-requests/update-rating-mutation';
import BreadcrumbLayout from '../../../components/layouts/breadcrumb-layout';
import useTopicResourceUserRating from '../../../hooks/use-topic-resource-user-rating';
import { Spinner } from 'react-bootstrap';

function TopicResourceDetails({ topicId, resourceId }) {
  const {
    data: topicResourceData,
    loading: topicResourceLoading,
    error: topicResourceLoadError,
    refetch: refetchTopicResourceData,
  } = useQuery(getTopicResourceByIdQuery, {
    variables: {
      topicId,
      resourceId,
    },
  });

  const topicResource = topicResourceData?.topicResource;
  const resourceName = topicResource?.resource?.name ?? 'Resource Details';
  const resourceLink = topicResource?.resource?.link;
  const averageRating = topicResource?.ratingList?.average;
  const topicResourceError = !topicResource || topicResourceLoadError;

  const [existingRating, setExistingRating] = useState();
  const [selectedRatingValue, setSelectedRatingValue] = useState(0);
  const {
    userRating,
    loading: userRatingLoading,
    error: userRatingLoadError,
  } = useTopicResourceUserRating(topicId, resourceId);

  useEffect(() => {
    if (userRating) {
      setExistingRating(userRating);

      const { value: ratingValue } = userRating;
      setSelectedRatingValue(ratingValue);
    }
  }, [userRating]);

  const ratingChanged = selectedRatingValue !== existingRating?.value;
  const validRating = selectedRatingValue > 0;
  const canSubmitRating = ratingChanged && validRating;

  const onSelectedRatingChanged = (r) => {
    setSubmitRatingError(null);
    setSelectedRatingValue(r);
  };

  const [createRating, { loading: isCreatingRating }] = useMutation(
    createRatingMutation,
    {
      variables: {
        topicId,
        resourceId,
        value: selectedRatingValue,
      },
    }
  );

  const ratingId = existingRating?.id;
  const [updateRating, { loading: isUpdatingRating }] = useMutation(
    updateRatingMutation,
    {
      variables: {
        ratingId,
        value: selectedRatingValue,
      },
    }
  );

  const [submitRatingError, setSubmitRatingError] = useState();

  const isSubmittingRating = isUpdatingRating || isCreatingRating;

  const submitRating = async () => {
    setSubmitRatingError(null);

    try {
      if (!existingRating) {
        const { data: createRatingData } = await createRating();

        const createdRating = createRatingData?.createRating;
        if (!createdRating) {
          throw new Error('Failed to create rating.');
        }

        const { id } = createdRating;
        setExistingRating({
          id,
          value: selectedRatingValue,
        });
      } else {
        const { data: updateRatingData } = await updateRating();

        const success = updateRatingData?.updateRating;
        if (!success) {
          throw new Error('Failed to update rating.');
        }

        setExistingRating({ ...existingRating, value: selectedRatingValue });
      }

      await refetchTopicResourceData();
    } catch (error) {
      setSubmitRatingError(error);
    }
  };

  const ratingTitle = existingRating ? 'Update Rating' : 'Add Rating';

  const { topicName } = useTopicName(topicId);

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

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <title>{resourceName ?? 'Resource Details'} - Resource Rank</title>

      <div>
        {topicResourceLoading && (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {!topicResourceLoading && (
          <div className="text-sm-start">
            {topicResourceError && <div>Failed to load topic resource.</div>}

            {!topicResourceError && (
              <div>
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto">
                    <div className="page-header">{resourceName}</div>
                  </div>
                  <div className="col-auto">
                    <RatingStars rating={averageRating} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="fs-2">Details</div>
                  <div className="mt-4 d-flex">
                    <div>Link:</div>
                    <div className="ms-3 text-break">
                      {resourceLink && (
                        <a href={resourceLink} target="_blank" rel="noreferrer">
                          {resourceLink}
                        </a>
                      )}
                      {!resourceLink && 'No resource link added.'}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="fs-2">{ratingTitle}</div>

                  <div className="mt-4">
                    {userRatingLoading && (
                      <div className="text-center">
                        <Spinner animation="border" role="status" />
                      </div>
                    )}

                    {!userRatingLoading && (
                      <div>
                        {userRatingLoadError && (
                          <div className="text-center text-sm-start">
                            Failed to load your rating for this topic resource.
                          </div>
                        )}

                        {!userRatingLoadError && (
                          <div>
                            <div className="d-inline-block">
                              <SelectableRatingStars
                                selectedRating={selectedRatingValue}
                                selectedRatingChanged={onSelectedRatingChanged}
                                starWidth={30}
                              />
                            </div>

                            <div className="mt-4">
                              <button
                                className="mt-2 btn btn-primary"
                                disabled={!canSubmitRating}
                                onClick={submitRating}
                              >
                                Submit
                              </button>
                            </div>

                            {isSubmittingRating && (
                              <div className="mt-4 text-center text-sm-start">
                                <Spinner animation="border" role="status" />
                              </div>
                            )}

                            {submitRatingError && (
                              <div className="mt-4 text-center text-sm-start">
                                Failed to submit rating.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </BreadcrumbLayout>
  );
}

TopicResourceDetails.propTypes = {
  topicId: PropTypes.string,
  resourceId: PropTypes.string,
};

export default TopicResourceDetails;
