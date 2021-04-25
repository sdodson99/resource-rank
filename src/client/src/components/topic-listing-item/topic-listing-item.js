import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import ListingItem from '../listing-item/listing-item';
import { ArrowRightCircle } from 'react-bootstrap-icons';

function TopicListingItem({ id, name }) {
  const resourcesLink = `/topics/${id}`;

  return (
    <Link to={resourcesLink} className="text-decoration-none text-dark">
      <ListingItem>
        <div className="row align-items-center justify-content-between text-center text-sm-start">
          <div className="col-sm-auto">{name}</div>
          <div className="col-sm-auto mt-3 mt-sm-0 font-xs">
            <ArrowRightCircle fill="#333" height="25" width="25" />
          </div>
        </div>
      </ListingItem>
    </Link>
  );
}

TopicListingItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

export default TopicListingItem;
