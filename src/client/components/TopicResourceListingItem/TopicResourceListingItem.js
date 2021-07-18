import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicResourceListingItem.module.css';
import Link from 'next/link';
import ListingItem from '../ListingItem/ListingItem';
import RatingStars from '../RatingStars/rating-stars';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const TopicResourceListingItem = ({
  topicId,
  resourceId,
  name,
  link,
  rating,
}) => {
  const topicResourceLink = `/topics/${topicId}/resources/${resourceId}`;

  return (
    <div
      className={styles.TopicResourceListingItem}
      data-testid="TopicResourceListingItem"
    >
      <Link href={topicResourceLink}>
        <a>
          <ListingItem hover={true}>
            <div className="sm:flex sm:justify-between items-center sm:text-left text-center py-5 px-3">
              <div className="col-sm-auto flex flex-col items-center sm:items-start">
                <div>{name}</div>
                <div className="mt-1">
                  <RatingStars rating={rating} />
                </div>
              </div>
              <div className="mt-5 sm:mt-0">
                <ArrowForwardIcon />
              </div>
            </div>
          </ListingItem>
        </a>
      </Link>
    </div>
  );
};

TopicResourceListingItem.propTypes = {
  topicId: PropTypes.string,
  resourceId: PropTypes.string,
  name: PropTypes.string,
  link: PropTypes.string,
  rating: PropTypes.number,
};

TopicResourceListingItem.defaultProps = {};

export default TopicResourceListingItem;
