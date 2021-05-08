import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Layout from '../../../components/layout/layout';
import HeaderButton from '../../../components/header-button/header-button';
import { useApolloClient, useMutation } from '@apollo/client';
import getAvailableResourcesQuery from '../../../gql-requests/get-available-resources-query';
import { concat, from, of, Subject } from 'rxjs';
import { debounceTime, map, mergeMap } from 'rxjs/operators';
import AddResourceListing from '../../../components/add-resource-listing/add-resource-listing';
import createTopicResourceMutation from '../../../gql-requests/create-topic-resource-mutation';
import { navigate } from 'gatsby';
import BreadcrumbListing from '../../../components/breadcrumbs/breadcrumb-listing';
import useTopicName from '../../../hooks/use-topic-name';

function AddTopicResource({ topicId }) {
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(true);
  const [availableResources, setAvailableResources] = useState([]);

  const searchInputSubject = useRef(new Subject()).current;
  const client = useApolloClient();
  const getAvailableResources = async (searchInput) => {
    try {
      const response = await client.query({
        query: getAvailableResourcesQuery,
        variables: {
          topicId,
          search: searchInput,
          limit: 20,
        },
      });

      return response?.data?.availableResources ?? [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const subscription = searchInputSubject
      .pipe(
        debounceTime(1000),
        mergeMap((searchInput) =>
          concat(
            of({ loading: true }),
            from(getAvailableResources(searchInput)).pipe(
              map((data) => ({ data }))
            )
          )
        )
      )
      .subscribe(({ data, loading }) => {
        if (loading) {
          return setSearchLoading(true);
        }

        setSearchLoading(false);
        setAvailableResources(data);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(async () => {
    const availableResources = await getAvailableResources(search);

    setAvailableResources(availableResources);
    setSearchLoading(false);
  }, []);

  const onSearchInput = (e) => {
    const searchInput = e.target.value;

    setSearch(searchInput);
    searchInputSubject.next(searchInput);
  };

  const [createTopicResource, { loading: creatingTopicResource }] = useMutation(
    createTopicResourceMutation
  );
  const onAddResource = async (resourceId) => {
    await createTopicResource({
      variables: {
        topicId,
        resourceId,
      },
    });

    navigate(`/topics/${topicId}`);
  };

  const isLoading = creatingTopicResource || searchLoading;

  const topicName = useTopicName(topicId);

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
    {
      to: `/topics/${topicId}`,
      title: topicName ?? 'Topic Details',
    },
    {
      to: `/topics/${topicId}/resources/add`,
      title: 'Add',
    },
  ];

  return (
    <Layout>
      <BreadcrumbListing breadcrumbs={breadcrumbs} />

      <HeaderButton
        title="Add Resource"
        buttonContent="New"
        linkTo={`/topics/${topicId}/resources/new`}
        className="mt-4"
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
        {isLoading && (
          <div className="text-center">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!isLoading && (
          <AddResourceListing
            availableResources={availableResources}
            onAddResource={onAddResource}
          />
        )}
      </div>
    </Layout>
  );
}

AddTopicResource.propTypes = {
  topicId: PropTypes.string,
};

export default AddTopicResource;
