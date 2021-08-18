import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicListingItem.module.css';
import Link from 'next/link';
import ListingItem from '../ListingItem/ListingItem';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import VerifiedIcon from '../VerifiedIcon/VerifiedIcon';

const TopicListingItem = ({ name, slug, verified }) => {
  const detailsLink = `/topics/${slug}`;

  return (
    <div className={styles.TopicListingItem} data-testid="TopicListingItem">
      <Link href={detailsLink}>
        <a>
          <ListingItem hover={true}>
            <div className="sm:flex sm:justify-between sm:text-left text-center">
              <div className="flex items-center">
                <div>{name}</div>
                {verified && (
                  <div className="ml-2">
                    <VerifiedIcon />
                  </div>
                )}
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

TopicListingItem.propTypes = {
  name: PropTypes.string,
  slug: PropTypes.string,
  verified: PropTypes.bool,
};

TopicListingItem.defaultProps = {
  name: '',
  slug: '',
};

export default TopicListingItem;
