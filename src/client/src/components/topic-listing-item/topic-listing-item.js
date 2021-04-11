import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

function TopicListingItem({ id, name }) {
  const resourcesLink = `/topics/details/${id}`;

  return (
    <div className="border border-1 p-3">
      <div className="row align-items-center justify-content-between">
        <div className="col-sm-auto">{name}</div>
        <div className="col-sm-auto font-xs">
          <Link to={resourcesLink}>Resources</Link>
        </div>
      </div>
    </div>
  );
}

TopicListingItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

export default TopicListingItem;
