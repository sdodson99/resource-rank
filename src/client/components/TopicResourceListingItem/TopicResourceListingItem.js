import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicResourceListingItem.module.css';
import ListingItem from '../ListingItem/ListingItem';
import RatingStarGroup from '../RatingStars/RatingStarGroup/RatingStarGroup';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import VerifiedIcon from '../VerifiedIcon/VerifiedIcon';
import Link from '../Link/Link';

const TopicResourceListingItem = ({
  topicId,
  resourceId,
  topicSlug,
  resourceSlug,
  name,
  rating,
  verified,
}) => {
  const topicResourceLink = `/topics/${topicSlug}/resources/${resourceSlug}`;

  return (
    <div
      className={styles.TopicResourceListingItem}
      data-testid="TopicResourceListingItem"
    >
      <Link url={{ pathname: topicResourceLink }}>
        <a>
          <ListingItem hover={true}>
            <div className="sm:flex sm:justify-between items-center sm:text-left text-center">
              <div className="col-sm-auto flex flex-col items-center sm:items-start">
                <div className="flex items-center justify-center sm:justify-start">
                  <div>{name}</div>
                  {verified && (
                    <div className="ml-2">
                      <VerifiedIcon />
                    </div>
                  )}
                </div>
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
  verified: PropTypes.bool,
};

TopicResourceListingItem.defaultProps = {};

export default TopicResourceListingItem;
