import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import TextInput from '@/components/TextInput/TextInput';
import ErrorAlert from '@/components/ErrorAlert/ErrorAlert';
import hasAlphaNumericCharacter from 'validators/alpha-numeric';
import isProfane from 'validators/profanity';
import { NextSeo } from 'next-seo';
import useTopicCreator from '@/hooks/topics/use-topic-creator';
import TopicExistsError from 'errors/topic-exists-error';

const FormField = {
  TOPIC_NAME: 'name',
};

const NewTopic = () => {
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

  const nameFieldOptions = {
    required: 'Required',
    maxLength: {
      value: 50,
      message: 'Must be less than 50 characters',
    },
    validate: {
      hasAlphaNumericCharacter: (name) =>
        hasAlphaNumericCharacter(name) ||
        'Must contain an alpha-numeric character',
      isNotProfane: (name) => !isProfane(name) || 'Must not contain profanity',
    },
  };

  const { createTopic } = useTopicCreator();
  const [createTopicError, setCreateTopicError] = useState();

  const onSubmit = async (formData) => {
    setCreateTopicError(null);

    const name = formData[FormField.TOPIC_NAME];

    try {
      const { slug } = await createTopic({ name });

      router.push(`/topics/${slug}`);
    } catch (error) {
      if (error instanceof TopicExistsError) {
        return setError(FormField.TOPIC_NAME, {
          message: 'Name already exists.',
        });
      }

      return setCreateTopicError(error);
    }
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
      <NextSeo
        title="New Topic"
        openGraph={{
          title: 'New Topic - Resource Rank',
          description: 'Create a new topic.',
        }}
      />

      <div className="text-4xl">New Topic</div>

      {createTopicError && (
        <div className="mt-10">
          <ErrorAlert border={true} scrollTo={!!createTopicError}>
            Failed to create topic.
          </ErrorAlert>
        </div>
      )}

      <form className="mt-10" onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <TextInput
          name={FormField.TOPIC_NAME}
          label="Topic Name"
          errorMessage={nameError}
          autoComplete="off"
          {...register(FormField.TOPIC_NAME, nameFieldOptions)}
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
              <LoadingSpinner size={30} />
            </div>
          )}
        </div>
      </form>
    </BreadcrumbLayout>
  );
};

export default NewTopic;
