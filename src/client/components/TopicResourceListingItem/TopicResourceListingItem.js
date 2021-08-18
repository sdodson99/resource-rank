import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicResourceListingItem.module.css';
import Link from 'next/link';
import ListingItem from '../ListingItem/ListingItem';
import RatingStarGroup from '../RatingStars/RatingStarGroup/RatingStarGroup';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const TopicResourceListingItem = ({
  topicId,
  resourceId,
  topicSlug,
  resourceSlug,
  name,
  rating,
}) => {
  const topicResourceLink = `/topics/${topicSlug}/resources/${resourceSlug}`;

  return (
    <div
      className={styles.TopicResourceListingItem}
      data-testid="TopicResourceListingItem"
    >
      <Link href={topicResourceLink}>
        <a>
          <ListingItem hover={true}>
            <div className="sm:flex sm:justify-between items-center sm:text-left text-center">
              <div className="col-sm-auto flex flex-col items-center sm:items-start">
                <div>{name}</div>
                <div className="mt-1">
                  <RatingStarGroup rating={rating} starSize={25} />
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
  topicSlug: PropTypes.string,
  resourceSlug: PropTypes.string,
  name: PropTypes.string,
  rating: PropTypes.number,
};

TopicResourceListingItem.defaultProps = {};

export default TopicResourceListingItem;
