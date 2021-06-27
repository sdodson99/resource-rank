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
          <ListingItem>
            <div>
              <div>{name}</div>
              <div>Click Me</div>
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
