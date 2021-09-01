import React from 'react';
import PageRange from './PageRange';

export default {
  component: PageRange,
  title: 'Components/Pagination/PageRange',
  decorators: [
    (Story) => {
      return (
        <div className="flex">
          <Story />
        </div>
      );
    },
  ],
};

const Template = (args) => <PageRange {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Many = Template.bind({});
Many.args = {
  last: 20,
};
