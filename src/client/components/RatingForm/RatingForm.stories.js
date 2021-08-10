import React from 'react';
import RatingForm from './RatingForm';

export default {
  component: RatingForm,
  title: 'Components/RatingForm',
};

const Template = (args) => <RatingForm {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Submitting = Template.bind({});
Submitting.args = {
  isSubmitting: true,
};

export const Error = Template.bind({});
Error.args = {
  error: new Error(),
};

export const ExistingRating = Template.bind({});
ExistingRating.args = {
  existingRating: 3,
};
