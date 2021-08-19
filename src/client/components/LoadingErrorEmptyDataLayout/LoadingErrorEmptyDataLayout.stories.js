import React from 'react';
import LoadingErrorEmptyDataLayout from './LoadingErrorEmptyDataLayout';

export default {
  component: LoadingErrorEmptyDataLayout,
  title: 'Components/LoadingErrorEmptyDataLayout',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <LoadingErrorEmptyDataLayout {...args} />;

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  loadingDisplay: 'Loading...',
};

export const Error = Template.bind({});
Error.args = {
  isLoading: false,
  hasError: true,
  errorDisplay: <div className="text-red-600">Something went wrong.</div>,
};

export const Empty = Template.bind({});
Empty.args = {
  isLoading: false,
  hasError: false,
  hasData: false,
  noDataDisplay: 'No data available.',
};

export const Data = Template.bind({});
Data.args = {
  isLoading: false,
  hasError: false,
  hasData: true,
  dataDisplay: 'Successfully loaded data!',
};
