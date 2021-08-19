import React from 'react';
import Layout from './Layout';

export default {
  component: Layout,
  title: 'Components/Layout',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <Layout {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: <div className="my-5 content-container">Hello world!</div>,
};
