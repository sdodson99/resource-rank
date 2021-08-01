import React, { useState } from 'react';
import SelectableRatingStarGroup from './SelectableRatingStarGroup';

export default {
  component: SelectableRatingStarGroup,
  title: 'Components/RatingStars/SelectableRatingStarGroup',
  args: {
    starSize: 50,
  },
};

const Template = (args) => {
  const [rating, setRating] = useState(args.rating ?? 0);

  return (
    <div>
      <SelectableRatingStarGroup
        {...args}
        rating={rating}
        onRatingChanged={setRating}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const Size = Template.bind({});
Size.args = {
  starSize: 100,
};

export const MaxRating = Template.bind({});
MaxRating.args = {
  maxRating: 12,
};

export const InitialRating = Template.bind({});
InitialRating.args = {
  rating: 3,
};
