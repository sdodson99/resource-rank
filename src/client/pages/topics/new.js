import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BreadcrumbLayout from '../../components/BreadcrumbLayout/BreadcrumbLayout';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import useCreateTopicMutation from '../../hooks/use-create-topic-mutation';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const FormField = {
  TOPIC_NAME: 'name',
};

export default function NewTopic() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      [FormField.TOPIC_NAME]: '',
    },
  });

  const [createTopicError, setCreateTopicError] = useState();

  const { execute: executeCreateTopicMutation, isLoading: isCreatingTopic } =
    useCreateTopicMutation();

  const isTopicAlreadyExistsError = (error) => {
    const errors = error.response?.errors;

    if (!Array.isArray(errors)) {
      return false;
    }

    if (errors.length === 0) {
      return false;
    }

    const errorCode = errors[0].extensions?.code;

    return errorCode === 'TOPIC_ALREADY_EXISTS';

    if (errorCode === 'TOPIC_ALREADY_EXISTS') {
    }
  };

  const onSubmit = async (formData) => {
    setCreateTopicError(null);

    const name = formData[FormField.TOPIC_NAME];

    const { data, error } = await executeCreateTopicMutation(name);

    if (error) {
      if (isTopicAlreadyExistsError(error)) {
        return setError(FormField.TOPIC_NAME, {
          message: 'Name already exists.',
        });
      } else {
        return setCreateTopicError(error);
      }
    }

    const createdTopicId = data?.createTopic?.id;

    if (!createdTopicId) {
      return setCreateTopicError(new Error('Failed to create topic.'));
    }

    router.push(`/topics/${createdTopicId}`);
  };

  const onInvalid = () => setCreateTopicError(null);

  const nameError = errors[FormField.TOPIC_NAME]?.message;

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
      <Head>
        <title>New Topic - Resource Rank</title>
      </Head>

      <div className="text-4xl">New Topic</div>

      <form className="mt-10" onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div className="flex flex-col">
          <label htmlFor={FormField.TOPIC_NAME}>Topic Name</label>
          <input
            className="mt-2 form-control flex-grow"
            type="text"
            {...register(FormField.TOPIC_NAME, {
              required: 'Required',
            })}
          />

          {nameError && (
            <div className="mt-2 error-text text-sm">{nameError}</div>
          )}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row">
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={isCreatingTopic}
          >
            Submit
          </button>
          <Link href="/topics">
            <a className="mt-3 text-center btn btn-danger-outline w-100 sm:mt-0 sm:ml-3">
              Cancel
            </a>
          </Link>

          {isCreatingTopic && (
            <div className="mt-5 sm:mt-0 sm:ml-3 self-center">
              <LoadingSpinner height={30} width={30} />
            </div>
          )}
        </div>

        <div className="text-center sm:text-left">
          {createTopicError && (
            <div className="mt-6 error-text">Failed to create topic.</div>
          )}
        </div>
      </form>
    </BreadcrumbLayout>
  );
}
