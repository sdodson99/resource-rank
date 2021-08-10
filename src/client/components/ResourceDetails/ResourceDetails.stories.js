import React from 'react';
import ResourceDetails from './ResourceDetails';

export default {
  component: ResourceDetails,
  title: 'Components/ResourceDetails',
};

const Template = (args) => <ResourceDetails {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Link = Template.bind({});
Link.args = {
  link: 'https://resource-rank.web.app/',
};
