import React from 'react';
import Layout from '../components/Layout/Layout';
import Head from 'next/head';

function _404_() {
  return (
    <Layout>
      <Head>
        <title>Page Not Found - Resource Rank</title>
      </Head>
      <div className="text-xl mt-10 text-center">Uh-oh! Page not found.</div>
    </Layout>
  );
}

export default _404_;
