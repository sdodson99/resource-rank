import React, { useState } from 'react';
import styles from './CallToAction.module.css';
import useNavigate from '@/hooks/use-navigate';

const CallToAction = () => {
  const [searchTopicsQuery, setSearchTopicsQuery] = useState('');
  const navigate = useNavigate();

  const onSearchTopicsQueryChange = (e) => {
    const value = e.target.value;

    setSearchTopicsQuery(value);
  };

  const onSearchTopics = () => {
    navigate({
      pathname: '/topics',
      query: {
        q: searchTopicsQuery,
      },
    });
  };

  return (
    <div className={styles.CallToAction} data-testid="CallToAction">
      <div className="content-container">
        <div className="text-6xl">
          What are <span className={styles.Emphasis}>you</span> waiting for?
        </div>
        <div className={styles.Search}>
          <input
            type="text"
            className="flex-grow block form-control-lg"
            placeholder="Search..."
            value={searchTopicsQuery}
            onChange={onSearchTopicsQueryChange}
          />
          <button
            className="mt-5 sm:mt-0 sm:ml-3 btn btn-primary"
            onClick={onSearchTopics}
          >
            Search Topics
          </button>
        </div>
      </div>
    </div>
  );
};

CallToAction.propTypes = {};

CallToAction.defaultProps = {};

export default CallToAction;
