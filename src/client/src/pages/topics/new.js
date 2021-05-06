import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';
import Layout from '../../components/layout/layout';
import topicExistsQuery from '../../gql-requests/topic-exists-query';
import { ApolloError, useApolloClient, useMutation } from '@apollo/client';
import createTopicMutation from '../../gql-requests/create-topic-mutation';
import LiveValidatingInput from '../../components/live-vaildating-input/live-validating-input';
import useLiveValidation from '../../hooks/use-live-validation';
import BreadcrumbListing from '../../components/breadcrumb-listing/breadcrumb-listing';

function CreateTopic() {
  const [name, setName] = useState('');

  const apolloClient = useApolloClient();

  const isAvailableTopicName = async (nameInput) => {
    const result = await apolloClient.query({
      query: topicExistsQuery,
      variables: {
        name: nameInput,
      },
    });

    const topicNameExists = result.data?.topicExists ?? false;

    return !topicNameExists;
  };

  const {
    isValid: isNameAvailable,
    isValidating: isValidatingName,
    validateValue: validateName,
    setIsValid: setIsValidName,
  } = useLiveValidation(isAvailableTopicName);

  const handleNameInput = (e) => {
    setIsValidName(true);

    const nameInput = e.target.value;

    setName(nameInput);
    validateName(nameInput);
  };

  const [createTopic] = useMutation(createTopicMutation);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createTopic({ variables: { name } });
      navigate('/');
    } catch (error) {
      if (error instanceof ApolloError) {
        const errorCode = error.graphQLErrors[0].extensions.code;

        if (errorCode === 'TOPIC_ALREADY_EXISTS') {
          setIsValidName(false);
        }
      }
    }
  };

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
    {
      to: '/topics/new',
      title: 'New',
    },
  ];

  return (
    <Layout>
      <BreadcrumbListing breadcrumbs={breadcrumbs} />

      <div className="page-header text-center text-sm-start mt-4">
        New Topic
      </div>

      <form onSubmit={submit}>
        <div className="mt-4">
          <label htmlFor="name">Name</label>
          <LiveValidatingInput
            id="name"
            value={name}
            onChange={handleNameInput}
            isValidating={isValidatingName}
            hasValidationError={!isNameAvailable}
            required={true}
            validationErrorMessage="Topic name already exists."
          />
        </div>

        <div className="mt-4 row align-items-center">
          <div className="col-sm-auto">
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={isValidatingName || !isNameAvailable}
            >
              Submit
            </button>
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0">
            <Link to="/" className="btn btn-outline-danger w-100">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </Layout>
  );
}

export default CreateTopic;
