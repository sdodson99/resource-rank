import React, { useState } from 'react';
import { useRouter } from 'next/router';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import { FormProvider, useForm } from 'react-hook-form';
import { NextSeo } from 'next-seo';
import useTopicCreator from '@/hooks/topics/use-topic-creator';
import TopicExistsError from '@/errors/topic-exists-error';
import TopicDetailsForm from '@/components/TopicDetailsForm/TopicDetailsForm';

const FormField = {
  TOPIC_NAME: 'name',
};

const NewTopic = () => {
  const router = useRouter();
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      [FormField.TOPIC_NAME]: '',
    },
  });
  const { setError } = methods;

  const { createTopic } = useTopicCreator();
  const [createTopicError, setCreateTopicError] = useState();

  const onSubmit = async (formData) => {
    setCreateTopicError(null);

    const name = formData[FormField.TOPIC_NAME];

    try {
      const { slug } = await createTopic({ name });

      router.push(`/topics/${slug}?new=true`);
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

  const createTopicErrorMessage = createTopicError && 'Failed to create topic.';

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
    <div data-testid="NewTopic">
      <BreadcrumbLayout breadcrumbs={breadcrumbs}>
        <NextSeo
          title="New Topic"
          openGraph={{
            title: 'New Topic - Resource Rank',
            description: 'Create a new topic.',
          }}
        />

        <div className="text-4xl">New Topic</div>

        <div className="mt-10">
          <FormProvider {...methods}>
            <TopicDetailsForm
              onSubmit={onSubmit}
              onInvalid={onInvalid}
              cancelHref={'/topics'}
              errorMessage={createTopicErrorMessage}
              nameFieldName={FormField.TOPIC_NAME}
            />
          </FormProvider>
        </div>
      </BreadcrumbLayout>
    </div>
  );
};

export default NewTopic;
