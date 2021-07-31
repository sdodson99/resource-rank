import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicListingItem.module.css';
import Link from 'next/link';
import ListingItem from '../ListingItem/ListingItem';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const TopicListingItem = ({ name, slug }) => {
  const detailsLink = `/topics/${slug}`;

  return (
    <div className={styles.TopicListingItem} data-testid="TopicListingItem">
      <Link href={detailsLink}>
        <a>
          <ListingItem hover={true}>
            <div className="sm:flex sm:justify-between sm:text-left text-center">
              <div>{name}</div>
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
};

TopicListingItem.defaultProps = {
  name: '',
  slug: '',
};

export default TopicListingItem;
