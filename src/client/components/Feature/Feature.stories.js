import React from 'react';
import Feature from './Feature';

export default {
  component: Feature,
  title: 'Components/Feature',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const Template = (args) => <Feature {...args} />;

export const Default = Template.bind({});
Default.args = {
  description: 'Super fast!',
  imageSrc: '/img/instantly-find.svg',
};
