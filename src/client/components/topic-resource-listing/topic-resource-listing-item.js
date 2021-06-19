import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from '../rating-stars/rating-stars';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import Link from 'next/link';
import HoverListingItem from '../listing-item/hover-listing-item';

function TopicResourceListingItem({ topicId, resourceId, name, link, rating }) {
  const topicResourceLink = `/topics/${topicId}/resources/${resourceId}`;

  return (
    <Link href={topicResourceLink} className="text-decoration-none text-dark">
      <HoverListingItem>
        <div className="px-3 row align-items-center justify-content-between text-center text-sm-start">
          <div className="col-sm-auto">
            <div>{name}</div>
            <div className="mt-1">
              <RatingStars rating={rating} />
            </div>
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0">
            <ArrowRightCircle fill="#333" height="25" width="25" />
          </div>
        </div>
      </HoverListingItem>
    </Link>
  );
}

TopicResourceListingItem.propTypes = {
  topicId: PropTypes.string,
  resourceId: PropTypes.string,
  name: PropTypes.string,
  link: PropTypes.string,
  rating: PropTypes.number,
};

export default TopicResourceListingItem;
