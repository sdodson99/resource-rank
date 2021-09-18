import React, { useState } from 'react';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import { FormProvider, useForm } from 'react-hook-form';
import { NextSeo } from 'next-seo';
import useTopicCreator from '@/hooks/topics/use-topic-creator';
import TopicExistsError from '@/errors/topic-exists-error';
import TopicDetailsForm from '@/components/TopicDetailsForm/TopicDetailsForm';
import withAuthentication from '@/components/WithAuthentication/WithAuthentication';
import useNavigate from '@/hooks/use-navigate';

const FormField = {
  TOPIC_NAME: 'name',
};

const NewTopic = () => {
  const navigate = useNavigate();
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
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const onSubmit = async (formData) => {
    setIsCreatingTopic(true);
    setCreateTopicError(null);

    const name = formData[FormField.TOPIC_NAME];

    try {
      const { slug } = await createTopic({ name });

      await navigate({
        pathname: `/topics/${slug}`,
        query: {
          new: true,
        },
      });
    } catch (error) {
      setIsCreatingTopic(false);

      if (error instanceof TopicExistsError) {
        return setError(FormField.TOPIC_NAME, {
          message: 'Name already exists.',
        });
      }

      setCreateTopicError(error);
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
              isSubmitting={isCreatingTopic}
            />
          </FormProvider>
        </div>
      </BreadcrumbLayout>
    </div>
  );
};

export { NewTopic as Page };
export default withAuthentication(NewTopic);
