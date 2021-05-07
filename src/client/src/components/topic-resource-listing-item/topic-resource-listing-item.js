import React from 'react';
import PropTypes from 'prop-types';
import ListingItem from '../listing-item/listing-item';
import AverageRatingStars from '../average-rating-stars/average-rating-stars';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import { Link } from 'gatsby';

function TopicResourceListingItem({
  topicId,
  resourceId,
  name,
  link,
  ratings,
}) {
  const topicResourceLink = `/topics/${topicId}/resources/${resourceId}`;

  return (
    <Link to={topicResourceLink} className="text-decoration-none text-dark">
      <ListingItem>
        <div className="row align-items-center justify-content-between text-center text-sm-start">
          <div className="col-sm-auto">
            <div>{name}</div>
            <div className="mt-1">
              <AverageRatingStars ratings={ratings} />
            </div>
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0">
            <ArrowRightCircle fill="#333" height="25" width="25" />
          </div>
        </div>
      </ListingItem>
    </Link>
  );
}

TopicResourceListingItem.propTypes = {
  topicId: PropTypes.string,
  resourceId: PropTypes.string,
  name: PropTypes.string,
  link: PropTypes.string,
  ratings: PropTypes.array,
};

export default TopicResourceListingItem;
