import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import TextInput from '@/components/TextInput/TextInput';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import useCreateResourceMutation from '@/hooks/mutations/use-create-resource-mutation';
import useCreateTopicResourceMutation from '@/hooks/mutations/use-create-topic-resource-mutation';
import getErrorCode from '@/graphql/errors/get-error-code';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import ErrorCode from '@/graphql/errors/error-code';
import ErrorAlert from '@/components/ErrorAlert/ErrorAlert';
import hasAlphaNumericCharacter from 'validators/alpha-numeric';
import isProfane from 'validators/profanity';
import { isURL } from 'validator';
import { NextSeo } from 'next-seo';

const FormField = {
  RESOURCE_NAME: 'name',
  RESOURCE_LINK: 'link',
};

const NewTopicResource = ({ topicId, topicName, topicSlug }) => {
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
      [FormField.RESOURCE_NAME]: '',
      [FormField.RESOURCE_LINK]: '',
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

  const linkFieldOptions = {
    required: 'Required',
    validate: {
      isURL: (link) => isURL(link) || 'Must be a valid URL',
    },
  };

  const [createResourceError, setCreateResourceError] = useState(null);
  const [createTopicResourceError, setCreateTopicResourceError] =
    useState(null);

  const { execute: executeCreateResourceMutation } =
    useCreateResourceMutation();
  const { execute: executeCreateTopicResourceMutation } =
    useCreateTopicResourceMutation();

  const onSubmit = async (formData) => {
    setCreateResourceError(null);
    setCreateTopicResourceError(null);

    const name = formData[FormField.RESOURCE_NAME];
    const link = formData[FormField.RESOURCE_LINK];

    const { data: resourceData, error: resourceError } =
      await executeCreateResourceMutation(name, link);

    if (resourceError) {
      const errorCode = getErrorCode(resourceError);

      if (errorCode === ErrorCode.RESOURCE_ALREADY_EXISTS) {
        return setError(FormField.RESOURCE_NAME, {
          message: 'Name already exists.',
        });
      }

      return setCreateResourceError(resourceError);
    }

    const resourceId = resourceData?.createResource?.id;

    if (!resourceId) {
      return setCreateResourceError(new Error('Failed to create resource.'));
    }

    const { data: topicResourceData, error: topicResourceError } =
      await executeCreateTopicResourceMutation(topicId, resourceId);

    if (topicResourceError) {
      return setCreateTopicResourceError(topicResourceError);
    }

    const success = topicResourceData?.createTopicResource;

    if (!success) {
      return setCreateTopicResourceError(
        new Error('Failed to create topic resource.')
      );
    }

    const resourceSlug = resourceData?.createResource?.slug;
    router.push(`/topics/${topicSlug}/resources/${resourceSlug}`);
  };

  const onInvalid = () => setCreateTopicResourceError(null);

  const nameError = errors[FormField.RESOURCE_NAME]?.message;
  const linkError = errors[FormField.RESOURCE_LINK]?.message;

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
      to: `/topics/${topicSlug}/resources/add`,
      title: 'Add',
    },
    {
      to: `/topics/${topicSlug}/resources/new`,
      title: 'New',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <NextSeo
        title="New Topic Resource"
        openGraph={{
          title: 'New Topic Resource - Resource Rank',
          description: `Create a new topic resource for ${topicName}.`,
        }}
      />

      <div className="text-4xl">New Topic Resource</div>

      {createResourceError && (
        <div className="mt-10">
          <ErrorAlert border={true} scrollTo={!!createResourceError}>
            Failed to create resource.
          </ErrorAlert>
        </div>
      )}

      {createTopicResourceError && (
        <div className="mt-10">
          <ErrorAlert border={true} scrollTo={!!createTopicResourceError}>
            Failed to create topic resource.
          </ErrorAlert>
        </div>
      )}

      <form className="mt-10" onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <TextInput
            name={FormField.RESOURCE_NAME}
            label="Name"
            errorMessage={nameError}
            autoComplete="off"
            {...register(FormField.RESOURCE_NAME, nameFieldOptions)}
          />
        </div>

        <div className="mt-6">
          <TextInput
            name={FormField.RESOURCE_LINK}
            label="Link"
            errorMessage={linkError}
            autoComplete="off"
            {...register(FormField.RESOURCE_LINK, linkFieldOptions)}
          />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row">
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </button>
          <Link href={`/topics/${topicSlug}/resources/add`}>
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
      </form>
    </BreadcrumbLayout>
  );
};

NewTopicResource.propTypes = {
  topicId: PropTypes.string,
  topicName: PropTypes.string,
  topicSlug: PropTypes.string,
};

export async function getServerSideProps({ req, params: { topicSlug } }) {
  try {
    const topic = await getTopicBySlug(topicSlug);

    if (!topic) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        topicId: topic.id,
        topicName: topic.name,
        topicSlug: topic.slug,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default NewTopicResource;
