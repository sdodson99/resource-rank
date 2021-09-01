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
  feature: {
    title: 'Super Fast!',
    description: 'We do our best to make things fast.',
    imageSrc: '/img/instantly-find.svg',
  },
};
