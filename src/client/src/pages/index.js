import React, { useEffect, useState } from 'react';

import Layout from '../components/layout/layout';
import TopicListing from '../components/topic-listing/topic-listing';
import useTopicProvider from '../hooks/use-topic-provider';

export default function Home() {
  const topicProvider = useTopicProvider();

  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [topics, setTopics] = useState([]);
  useEffect(async () => {
    setIsLoadingTopics(true);

    try {
      const topics = await topicProvider.getTopics();
      setTopics(topics);

      console.log(topics);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingTopics(false);
    }
  }, []);

  const createTopic = () => {
    console.log('create');
  };

  return (
    <Layout>
      <div className="row align-items-center justify-content-between">
        <div className="col-auto">
          <div className="page-header">Topics</div>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={createTopic}>
            Create
          </button>
        </div>
      </div>
      <div className="mt-3">
        {isLoadingTopics && <div>Loading...</div>}
        {!isLoadingTopics && <TopicListing topics={topics} />}
      </div>
    </Layout>
  );
}
