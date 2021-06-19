import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import HoverListingItem from '../listing-item/hover-listing-item';

function TopicListingItem({ id, name }) {
  const resourcesLink = `/topics/${id}`;

  return (
    <Link href={resourcesLink} className="text-decoration-none text-dark">
      <HoverListingItem>
        <div className="px-3 row align-items-center justify-content-between text-center text-sm-start">
          <div className="col-sm-auto">{name}</div>
          <div className="col-sm-auto mt-3 mt-sm-0 font-xs">
            <ArrowRightCircle fill="#333" height="25" width="25" />
          </div>
        </div>
      </HoverListingItem>
    </Link>
  );
}

TopicListingItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

export default TopicListingItem;
