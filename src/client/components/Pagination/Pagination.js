import React from 'react';
import PropTypes from 'prop-types';
import styles from './Pagination.module.css';
import coerceNumberToRange from './util/coerceNumberToRange';
import Page from './Page/Page';
import PageGap from './PageGap/PageGap';
import PageRange from './PageRange/PageRange';

const Pagination = ({
  selectedPage,
  pageCount,
  onPageClicked,
  selectedPageRange,
  selectedPageGapMinRange,
}) => {
  const firstPage = 1;
  const lastPage = pageCount;
  const coercedSelectedPage = coerceNumberToRange(
    selectedPage,
    firstPage,
    lastPage
  );

  const preSelectedFirstPage = coercedSelectedPage - selectedPageRange;
  const postSelectedLastPage = coercedSelectedPage + selectedPageRange;

  const showPreSelectedPageGap =
    preSelectedFirstPage - firstPage >= selectedPageGapMinRange;
  const showPostSelectedPageGap =
    lastPage - postSelectedLastPage >= selectedPageGapMinRange;

  return (
    <div className={styles.Pagination} data-testid="Pagination">
      {showPreSelectedPageGap && (
        <div className="flex">
          <Page number={firstPage} onClick={onPageClicked} />
          <PageGap />
          <PageRange
            first={preSelectedFirstPage}
            last={coercedSelectedPage - 1}
            onClick={onPageClicked}
          />
        </div>
      )}
      {!showPreSelectedPageGap && (
        <PageRange
          first={firstPage}
          last={coercedSelectedPage - 1}
          onClick={onPageClicked}
        />
      )}

      <Page number={coercedSelectedPage} isSelected={true} />

      {showPostSelectedPageGap && (
        <div className="flex">
          <PageRange
            first={coercedSelectedPage + 1}
            last={postSelectedLastPage}
            onClick={onPageClicked}
          />
          <PageGap />
          <Page number={lastPage} onClick={onPageClicked} />
        </div>
      )}
      {!showPostSelectedPageGap && (
        <PageRange
          first={coercedSelectedPage + 1}
          last={lastPage}
          onClick={onPageClicked}
        />
      )}
    </div>
  );
};

Pagination.propTypes = {
  selectedPage: PropTypes.number,
  pageCount: PropTypes.number,
  onPageClicked: PropTypes.func,
  selectedPageRange: PropTypes.number,
  selectedPageGapMinRange: PropTypes.number,
};

Pagination.defaultProps = {
  selectedPage: 1,
  pageCount: 1,
  selectedPageRange: 2,
  selectedPageGapMinRange: 3,
};

export default Pagination;
