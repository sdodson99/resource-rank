import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LiveValidatingInput from '../../../components/live-vaildating-input/live-validating-input';
import { Link, navigate } from 'gatsby';
import useLiveValidation from '../../../hooks/use-live-validation';
import { ApolloError, useApolloClient, useMutation } from '@apollo/client';
import resourceExistsQuery from '../../../gql-requests/resource-exists-query';
import createResourceMutation from '../../../gql-requests/create-resource-mutation';
import createTopicResourceMutation from '../../../gql-requests/create-topic-resource-mutation';
import useTopicName from '../../../hooks/use-topic-name';
import BreadcrumbLayout from '../../../components/layouts/breadcrumb-layout';

function NewTopicResource({ topicId }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const apolloClient = useApolloClient();
  const isAvailableResourceName = async (nameInput) => {
    const result = await apolloClient.query({
      query: resourceExistsQuery,
      variables: {
        name: nameInput,
      },
    });

    const resourceNameExists = result.data?.resourceExists ?? false;

    return !resourceNameExists;
  };

  const {
    isValid: isValidName,
    isValidating: isValidatingName,
    setIsValid: setIsValidName,
    validateValue: validateName,
  } = useLiveValidation(isAvailableResourceName);

  const onNameChange = (e) => {
    setIsValidName(true);

    const nameInput = e.target.value;

    setName(nameInput);
    validateName(nameInput);
  };

  const [createResource] = useMutation(createResourceMutation);
  const [createTopicResource] = useMutation(createTopicResourceMutation);

  const submit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await createResource({ variables: { name, link } });

      const { id: resourceId } = data.createResource;

      await createTopicResource({ variables: { topicId, resourceId } });

      navigate(`/topics/${topicId}`);
    } catch (error) {
      if (error instanceof ApolloError) {
        const errorCode = error.graphQLErrors[0].extensions.code;

        if (errorCode === 'RESOURCE_ALREADY_EXISTS') {
          setIsValidName(false);
        }
      }
    }
  };

  const canSubmit = isValidName;

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
            hasValidationError={!isValidName}
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
      </form>
    </BreadcrumbLayout>
  );
}

NewTopicResource.propTypes = {
  topicId: PropTypes.string,
};

export default NewTopicResource;
