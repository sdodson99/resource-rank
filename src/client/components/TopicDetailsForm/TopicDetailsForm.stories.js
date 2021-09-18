import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TopicDetailsForm from './TopicDetailsForm';

export default {
  component: TopicDetailsForm,
  title: 'Components/TopicDetailsForm',
  // Fixes a storybook issue for maximum call stack exceeding.
  parameters: { docs: { source: { type: 'code' } } },
  decorators: [
    (Story) => {
      const methods = useForm({
        mode: 'onBlur',
        reValidateMode: 'onChange',
      });

      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
};

const Template = (args) => <TopicDetailsForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  nameFieldName: 'name',
  cancelHref: '/',
};

export const Submitting = Template.bind({});
Submitting.args = {
  ...Default.args,
  isSubmitting: true,
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  errorMessage: 'Failed to submit form.',
};
