import React from 'react';
import ActiveLink from './ActiveLink';

export default {
  component: ActiveLink,
  title: 'Components/ActiveLink',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <ActiveLink {...args} />;

export const Default = Template.bind({});
Default.args = {
  href: '/page',
  children: 'Click me',
};

export const Active = Template.bind({});
Active.args = {
  href: '',
  children: 'Already active',
  activeClassName: 'text-red-800',
};
