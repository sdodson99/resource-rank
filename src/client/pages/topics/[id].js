import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '../../components/BreadcrumbLayout/BreadcrumbLayout';
import { createGraphQLFetcher } from '../../services/graphql-fetchers/graphql-fetcher-factory';
import getTopicNameByIdQuery from '../../gql-requests/get-topic-name-by-id-query';
import Head from 'next/head';
import Link from 'next/link';
import LoadingErrorEmptyDataLayout from '../../components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import useAuthenticationContext from '../../hooks/authentication/use-authentication-context';
import useTopicResourceSearchQuery from '../../hooks/use-topic-resource-search-query';
import useDebounce from '../../hooks/use-debounce';
import TopicResourceListing from '../../components/TopicResourceListing/TopicResourceListing';

const TopicDetails = ({ id, name }) => {
  const { isLoggedIn } = useAuthenticationContext();
  const [search, setSearch] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const {
    data: topicResources,
    error: topicResourcesError,
    isLoading: isLoadingTopicResources,
    execute: executeTopicResourceSearchQuery,
  } = useTopicResourceSearchQuery(id);

  const executeTopicResourceSearch = (search) => {
    setCurrentSearch(search);
    executeTopicResourceSearchQuery(search);
  };

  useEffect(() => {
    executeTopicResourceSearch(search);
  }, []);

  const debounceExecuteTopicResourceSearch = useDebounce(
    executeTopicResourceSearch,
    1000
  );

  const onSearchChange = (e) => {
    const searchInput = e.target.value;
    setSearch(searchInput);

    debounceExecuteTopicResourceSearch(searchInput);
  };

  const getNoDataDisplay = () => {
    if (currentSearch) {
      return `No topic resources matching '${currentSearch}' have been added.`;
    }

    return 'No topic resources have been added.';
  };

  const hasTopicResources = topicResources && topicResources.length > 0;
  const orderedResources = topicResources.sort(
    (r1, r2) => r2.ratingList?.average - r1.ratingList?.average
  );

  const topicLink = `/topics/${id}`;
  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
    {
      to: topicLink,
      title: name,
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>{name} - Resource Rank</title>
      </Head>

      <div className="text-4xl">{name}</div>

      <div className="mt-10 flex justify-between">
        <div className="text-3xl">Resources</div>

        {isLoggedIn && (
          <div className="flex ml-4">
            <Link href={`/topics/${id}/resources/add`}>
              <a className="btn btn-primary">Add</a>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8">
        <input
          className="w-full"
          placeholder="Search resources..."
          type="text"
          onChange={onSearchChange}
          value={search}
        />

        <div className="mt-8">
          <LoadingErrorEmptyDataLayout
            isLoading={isLoadingTopicResources}
            loadingDisplay={<div className="text-center">Loading</div>}
            hasError={!!topicResourcesError}
            errorDisplay={
              <div className="text-center sm:text-left">
                Failed to load topic resources.
              </div>
            }
            hasData={hasTopicResources}
            noDataDisplay={
              <div className="text-center sm:text-left">
                {getNoDataDisplay()}
              </div>
            }
            dataDisplay={
              <TopicResourceListing
                topicId={id}
                topicResources={orderedResources}
              />
            }
          />
        </div>
      </div>
    </BreadcrumbLayout>
  );
};

TopicDetails.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

export async function getServerSideProps({ req, params: { id } }) {
  const graphqlFetcher = createGraphQLFetcher();

  const topicResult = await graphqlFetcher.fetch(getTopicNameByIdQuery, { id });
  const name = topicResult?.topic?.name;

  if (!name) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id,
      name,
    },
  };
}

export default TopicDetails;
