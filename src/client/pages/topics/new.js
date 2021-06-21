import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LiveValidatingInput from '../../components/live-vaildating-input/live-validating-input';
import useAvailableTopicNameValidator from '../../hooks/use-available-topic-name-validator';
import TopicExistsError from '../../errors/topic-exists-error';
import useTopicCreator from '../../hooks/use-topic-creator';
import { Spinner } from 'react-bootstrap';
import BreadcrumbLayout from '../../components/layouts/breadcrumb-layout';
import useLiveValidation from '../../hooks/use-live-validation';

function CreateTopic() {
  const [name, setName] = useState('');
  const [createTopicError, setCreateTopicError] = useState();
  const router = useRouter();

  const validateIsAvailableTopicName = useAvailableTopicNameValidator();

  const {
    isValid: isAvailableTopicName,
    setIsValid: setIsValidName,
    validateInput: validateName,
    isValidating: isValidatingName,
  } = useLiveValidation(validateIsAvailableTopicName);

  const handleNameInput = (e) => {
    setCreateTopicError(null);

    const nameInput = e.target.value;

    setName(nameInput);
    validateName(nameInput);
  };

  const { createTopic, isCreatingTopic } = useTopicCreator();

  const submit = async (e) => {
    e.preventDefault();

    setCreateTopicError(null);

    try {
      await createTopic(name);
      router.push('/topics');
    } catch (error) {
      if (error instanceof TopicExistsError) {
        return setIsValidName(false);
      }

      setCreateTopicError(error);
    }
  };

  const canSubmit = !isValidatingName && isAvailableTopicName;

  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
    {
      to: '/topics/new',
      title: 'New',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <title>New Topic - Resource Rank</title>

      <div className="page-header">New Topic</div>

      <form onSubmit={submit}>
        <div className="mt-4">
          <label htmlFor="name">Name</label>
          <LiveValidatingInput
            id="name"
            value={name}
            onChange={handleNameInput}
            isValidating={isValidatingName}
            hasValidationError={!isAvailableTopicName}
            required={true}
            validationErrorMessage="Topic name already exists."
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
            <Link href="/topics" className="btn btn-outline-danger w-100">
              Cancel
            </Link>
          </div>
        </div>

        <div className="text-center text-sm-start">
          {createTopicError && (
            <div className="mt-4 text-danger">Failed to create topic.</div>
          )}

          {isCreatingTopic && (
            <div className="mt-4">
              <Spinner animation="border" role="status" />
            </div>
          )}
        </div>
      </form>
    </BreadcrumbLayout>
  );
}

export default CreateTopic;