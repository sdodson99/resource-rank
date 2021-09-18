import React from 'react';
import PropTypes from 'prop-types';
import styles from './Page.module.css';

const Page = ({ number, onClick, isSelected }) => {
  const onPageClick = () => onClick && onClick(number);

  const calculateClassName = () => {
    if (isSelected) {
      return styles.SelectedPage;
    }

    return styles.Page;
  };

  return (
    <button
      className={calculateClassName()}
      data-testid="Page"
      type="button"
      onClick={onPageClick}
      disabled={isSelected}
    >
      {number}
    </button>
  );
};

Page.propTypes = {
  number: PropTypes.number,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};

Page.defaultProps = {
  number: 1,
};

export default Page;
