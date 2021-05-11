import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LiveValidatingInput from '../../../components/live-vaildating-input/live-validating-input';
import { Link, navigate } from 'gatsby';
import { useApolloClient } from '@apollo/client';
import resourceExistsQuery from '../../../gql-requests/resource-exists-query';
import useTopicName from '../../../hooks/use-topic-name';
import BreadcrumbLayout from '../../../components/layouts/breadcrumb-layout';
import { Spinner } from 'react-bootstrap';
import useLiveValidation from '../../../hooks/use-live-validation';
import useTopicResourceCreator from '../../../hooks/use-topic-resource-creator';
import useResourceCreator from '../../../hooks/use-resource-creator';
import ResourceExistsError from '../../../errors/resource-exists-error';

function NewTopicResource({ topicId }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [submitError, setSubmitError] = useState();

  const apolloClient = useApolloClient();
  const validateIsAvailableResourceName = async (nameInput) => {
    const { data } = await apolloClient.query({
      query: resourceExistsQuery,
      variables: {
        name: nameInput,
      },
    });

    const resourceNameExists = data?.resourceExists ?? false;

    return !resourceNameExists;
  };

  const {
    isValid: isAvailableResourceName,
    setIsValid: setIsValidName,
    validateInput: validateName,
    isValidating: isValidatingName,
  } = useLiveValidation(validateIsAvailableResourceName);

  const onNameChange = (e) => {
    setSubmitError(null);

    const nameInput = e.target.value;

    setName(nameInput);
    validateName(nameInput);
  };

  const { createResource, isCreatingResource } = useResourceCreator();
  const {
    createTopicResource,
    isCreatingTopicResource,
  } = useTopicResourceCreator();

  const isSubmitting = isCreatingResource || isCreatingTopicResource;

  const submit = async (e) => {
    e.preventDefault();

    setSubmitError(null);

    try {
      const { id: resourceId } = await createResource(name, link);
      await createTopicResource(topicId, resourceId);

      navigate(`/topics/${topicId}`);
    } catch (error) {
      if (error instanceof ResourceExistsError) {
        return setIsValidName(false);
      }

      setSubmitError(error);
    }
  };

  const canSubmit = isAvailableResourceName;

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
      to: `/topics/${topicId}/resources/add`,
      title: 'Add',
    },
    {
      to: `/topics/${topicId}/resources/new`,
      title: 'New',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <div className="page-header text-center text-sm-start">New Resource</div>

      <form onSubmit={submit}>
        <div className="mt-4">
          <label htmlFor="name">Name</label>
          <LiveValidatingInput
            id="name"
            value={name}
            hasValidationError={!isAvailableResourceName}
            isValidating={isValidatingName}
            onChange={onNameChange}
            required={true}
            validationErrorMessage="Resource name already exists."
          />
        </div>

        <div className="mt-3">
          <label htmlFor="link">Link</label>
          <input
            id="link"
            className="form-control mt-1"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required={true}
            type="text"
          />
        </div>

        <div className="mt-4 row align-items-center">
          <div className="col-sm-auto">
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={!canSubmit}
            >
              Submit
            </button>
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0">
            <Link
              to={`/topics/${topicId}/resources/add`}
              className="btn btn-outline-danger w-100"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="text-center text-sm-start">
          {submitError && (
            <div className="mt-4 text-danger">
              Failed to create topic resource.
            </div>
          )}

          {isSubmitting && (
            <div className="mt-4">
              <Spinner animation="border" role="status" />
            </div>
          )}
        </div>
      </form>
    </BreadcrumbLayout>
  );
}

NewTopicResource.propTypes = {
  topicId: PropTypes.string,
};

export default NewTopicResource;
