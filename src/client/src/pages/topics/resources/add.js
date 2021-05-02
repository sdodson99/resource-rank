import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Layout from '../../../components/layout/layout';
import HeaderButton from '../../../components/header-button/header-button';
import { useApolloClient } from '@apollo/client';
import getAvailableResourcesQuery from '../../../gql-requests/get-available-resources-query';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

function AddTopicResource({ topicId }) {
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(true);
  const [availableResources, setAvailableResources] = useState([]);

  const searchInputSubject = useRef(new Subject()).current;
  const client = useApolloClient();
  const getAvailableResources = async (searchInput) => {
    // TODO: Make this function more pure.
    setSearchLoading(true);

    try {
      const response = await client.query({
        query: getAvailableResourcesQuery,
        fetchPolicy: 'no-cache',
        variables: {
          topicId,
          search: searchInput,
          limit: 20,
        },
      });

      return response?.data?.availableResources ?? [];
    } catch (error) {
      return [];
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const subscription = searchInputSubject
      .pipe(debounceTime(1000), switchMap(getAvailableResources))
      .subscribe((data) => {
        setAvailableResources(data);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(async () => {
    const availableResources = await getAvailableResources();
    setAvailableResources(availableResources);
  }, []);

  const onSearchInput = (e) => {
    const searchInput = e.target.value;

    setSearch(searchInput);
    searchInputSubject.next(searchInput);
  };

  return (
    <Layout>
      <HeaderButton
        title="Add Resource"
        buttonContent="New"
        linkTo={`/topics/${topicId}/resources/add`}
      />

      <div className="mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onInput={onSearchInput}
        />
      </div>

      <div className="mt-4">
        {searchLoading && (
          <div className="text-center">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!searchLoading && <div>{availableResources.length}</div>}
      </div>
    </Layout>
  );
}

AddTopicResource.propTypes = {
  topicId: PropTypes.string,
};

export default AddTopicResource;
