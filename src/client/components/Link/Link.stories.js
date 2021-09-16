import { MockProvider } from '@/hooks/use-mock-context';
import React from 'react';
import Link from './Link';

export default {
  component: Link,
  title: 'Components/Link',
  decorators: [
    (Story) => {
      return;
      <MockProvider>
        <Story />
      </MockProvider>;
    },
  ],
};

const Template = (args) => <Link {...args} />;

export const Default = Template.bind({});
Default.args = {
  url: {
    pathname: '/topics',
  },
  children: 'Click Me',
};
