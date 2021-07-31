import React from 'react';
import SelectableRatingStarGroup from './SelectableRatingStarGroup';

export default {
  component: SelectableRatingStarGroup,
  title: 'Components/RatingStars/SelectableRatingStarGroup',
};

const Template = (args) => <SelectableRatingStarGroup {...args} />;

export const Default = Template.bind({});
Default.args = {};
