import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '../../../../components/BreadcrumbLayout/BreadcrumbLayout';
import getTopicName from '../../../../services/topic-names/graphql-topic-name-service';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import TextInput from '../../../../components/TextInput/TextInput';
import Link from 'next/link';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import useCreateResourceMutation from '../../../../hooks/use-create-resource-mutation';
import useCreateTopicResourceMutation from '../../../../hooks/use-create-topic-resource-mutation';
import getErrorCode from '../../../../graphql/errors/getErrorCode';

const FormField = {
  RESOURCE_NAME: 'name',
  RESOURCE_LINK: 'link',
};

const NewTopicResource = ({ topicId, topicName }) => {
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

  const [createResourceError, setCreateResourceError] = useState(null);
  const [createTopicResourceError, setCreateTopicResourceError] =
    useState(null);

  const { execute: executeCreateResourceMutation } =
    useCreateResourceMutation();
  const { execute: executeCreateTopicResourceMutation } =
    useCreateTopicResourceMutation();

  const isResourceAlreadyExistsError = (error) => {
    const errorCode = getErrorCode(error);

    return errorCode === 'RESOURCE_ALREADY_EXISTS';
  };

  const onSubmit = async (formData) => {
    setCreateResourceError(null);
    setCreateTopicResourceError(null);

    const name = formData[FormField.RESOURCE_NAME];
    const link = formData[FormField.RESOURCE_LINK];

    const { data: resourceData, error: resourceError } =
      await executeCreateResourceMutation(name, link);

    if (resourceError) {
      if (isResourceAlreadyExistsError(resourceError)) {
        return setError(FormField.RESOURCE_NAME, {
          message: 'Name already exists.',
        });
      } else {
        return setCreateResourceError(resourceError);
      }
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
      return setCreateTopicResourceError(new Error('Failed to create topic resource.'));
    }

    router.push(`/topics/${topicId}/resources/${resourceId}`);
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
      to: `/topics/${topicId}`,
      title: topicName,
    },
    {
      to: `/topics/${topicId}/resources/new`,
      title: 'New',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>New Topic Resource - Resource Rank</title>
      </Head>

      <div className="text-4xl">New Topic Resource</div>

      <form className="mt-10" onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <TextInput
            name={FormField.RESOURCE_NAME}
            label="Resource Name"
            errorMessage={nameError}
            autoComplete="off"
            {...register(FormField.RESOURCE_NAME, {
              required: 'Required',
            })}
          />
        </div>

        <div className="mt-6">
          <TextInput
            name={FormField.RESOURCE_LINK}
            label="Link"
            errorMessage={linkError}
            autoComplete="off"
            {...register(FormField.RESOURCE_LINK, {
              required: 'Required',
            })}
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
          <Link href={`/topics/${topicId}/resources/add`}>
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
          {createResourceError && (
            <div className="mt-6 error-text">Failed to create resource.</div>
          )}

          {createTopicResourceError && (
            <div className="mt-6 error-text">
              Failed to create topic resource.
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
};

export async function getServerSideProps({ req, params: { topicId } }) {
  try {
    const topicName = await getTopicName(topicId);

    return {
      props: {
        topicId,
        topicName,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default NewTopicResource;
