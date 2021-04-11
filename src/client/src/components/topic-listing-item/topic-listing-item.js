import React from 'react';
import PropTypes from 'prop-types';

function TopicListingItem({ id, name }) {
  return (
    <div>
      <div>{name}</div>
    </div>
  );
}

TopicListingItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

export default TopicListingItem;
