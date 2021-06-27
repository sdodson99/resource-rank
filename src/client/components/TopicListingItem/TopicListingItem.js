import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicListingItem.module.css';
import Link from 'next/link';
import ListingItem from '../ListingItem/ListingItem';

const TopicListingItem = ({ id, name }) => {
  const resourcesLink = `/topics/${id}`;

  return (
    <div className={styles.TopicListingItem} data-testid="TopicListingItem">
      <Link href={resourcesLink}>
        <a>
          <ListingItem hover={true}>
            <div className="sm:flex sm:justify-between sm:text-left text-center py-5 px-3">
              <div>{name}</div>
              <div className="mt-5 sm:mt-0">Click Me</div>
            </div>
          </ListingItem>
        </a>
      </Link>
    </div>
  );
};

TopicListingItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

TopicListingItem.defaultProps = {
  id: '',
  name: '',
};

export default TopicListingItem;
