import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import useCreateTopicMutation from '@/hooks/use-create-topic-mutation';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import TextInput from '@/components/TextInput/TextInput';
import getErrorCode from '@/graphql/errors/getErrorCode';

const FormField = {
  TOPIC_NAME: 'name',
};

export default function NewTopic() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      [FormField.TOPIC_NAME]: '',
    },
  });

  const [createTopicError, setCreateTopicError] = useState();

  const { execute: executeCreateTopicMutation } = useCreateTopicMutation();

  const isTopicAlreadyExistsError = (error) => {
    const errorCode = getErrorCode(error);

    return errorCode === 'TOPIC_ALREADY_EXISTS';
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

    const createdTopicSlug = data?.createTopic?.slug;

    if (!createdTopicSlug) {
      return setCreateTopicError(new Error('Failed to create topic.'));
    }

    router.push(`/topics/${createdTopicSlug}`);
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
        <TextInput
          name={FormField.TOPIC_NAME}
          label="Topic Name"
          errorMessage={nameError}
          autoComplete="off"
          {...register(FormField.TOPIC_NAME, {
            required: 'Required',
          })}
        />

        <div className="mt-10 flex flex-col sm:flex-row">
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </button>
          <Link href="/topics">
            <a className="mt-3 text-center btn btn-danger-outline w-100 sm:mt-0 sm:ml-3">
              Cancel
            </a>
          </Link>

          {isSubmitting && (
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
