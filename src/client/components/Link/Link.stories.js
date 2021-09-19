import React from 'react';
import Link from './Link';

export default {
  component: Link,
  title: 'Components/Link',
};

const Template = (args) => <Link {...args} />;

export const Default = Template.bind({});
Default.args = {
  url: {
    pathname: '/topics',
  },
  children: 'Click Me',
};
