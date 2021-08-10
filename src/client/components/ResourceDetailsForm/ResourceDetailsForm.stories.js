import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ResourceDetailsForm from './ResourceDetailsForm';

export default {
  component: ResourceDetailsForm,
  title: 'Components/ResourceDetailsForm', 
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

const Template = (args) => <ResourceDetailsForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  nameFieldName: 'name',
  linkFieldName: 'link',
  cancelHref: '/',
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  errorMessage: 'Failed to submit form.',
};
