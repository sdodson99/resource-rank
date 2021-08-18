import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import { NextSeo } from 'next-seo';
import ResourceDetailsForm from '@/components/ResourceDetailsForm/ResourceDetailsForm';
import ErrorAlert from '@/components/Alerts/ErrorAlert/ErrorAlert';
import useTopicResourceCreator from '@/hooks/topics/use-topic-resource-creator';
import useResourceCreator from '@/hooks/resources/use-resource-creator';
import ResourceExistsError from '@/errors/resource-exists-error';

const FormField = {
  RESOURCE_NAME: 'name',
  RESOURCE_LINK: 'link',
};

const NewTopicResource = ({ topicId, topicName, topicSlug }) => {
  const router = useRouter();
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      [FormField.RESOURCE_NAME]: '',
      [FormField.RESOURCE_LINK]: '',
    },
  });
  const { setError } = methods;

  const [createResourceError, setCreateResourceError] = useState(null);
  const [createTopicResourceError, setCreateTopicResourceError] =
    useState(null);

  const { createResource } = useResourceCreator();
  const { createTopicResource } = useTopicResourceCreator();

  const onSubmit = async (formData) => {
    setCreateResourceError(null);
    setCreateTopicResourceError(null);

    const name = formData[FormField.RESOURCE_NAME];
    const link = formData[FormField.RESOURCE_LINK];

    try {
      const { id: resourceId, slug: resourceSlug } = await createResource({
        name,
        link,
      });
      const success = await createTopicResource(topicId, resourceId);

      if (!success) {
        return setCreateTopicResourceError(
          new Error('Failed to create topic resource.')
        );
      }

      router.push(`/topics/${topicSlug}/resources/${resourceSlug}?new=true`);
    } catch (error) {
      if (error instanceof ResourceExistsError) {
        return setError(FormField.RESOURCE_NAME, {
          message: 'Name already exists.',
        });
      }

      return setCreateResourceError(error);
    }
  };

  const onInvalid = () => {
    setCreateResourceError(null);
    setCreateTopicResourceError(null);
  };

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

  const createResourceErrorMessage =
    createResourceError && 'Failed to create resource.';

  return (
    <div data-testid="NewTopicResourcePage">
      <BreadcrumbLayout breadcrumbs={breadcrumbs}>
        <NextSeo
          title="New Topic Resource"
          openGraph={{
            title: 'New Topic Resource - Resource Rank',
            description: `Create a new topic resource for ${topicName}.`,
          }}
        />

        <div className="text-4xl">New Topic Resource</div>

        {createTopicResourceError && (
          <div className="mt-10">
            <ErrorAlert border={true} scrollTo={!!createTopicResourceError}>
              Failed to create topic resource.
            </ErrorAlert>
          </div>
        )}

        <div className="mt-10">
          <FormProvider {...methods}>
            <ResourceDetailsForm
              onSubmit={onSubmit}
              onInvalid={onInvalid}
              cancelHref={`/topics/${topicSlug}/resources/add`}
              errorMessage={createResourceErrorMessage}
              nameFieldName={FormField.RESOURCE_NAME}
              linkFieldName={FormField.RESOURCE_LINK}
            />
          </FormProvider>
        </div>
      </BreadcrumbLayout>
    </div>
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
