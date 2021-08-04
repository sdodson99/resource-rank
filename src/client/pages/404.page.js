import React from 'react';
import Layout from '@/components/Layout/Layout';
import { NextSeo } from 'next-seo';

function _404_() {
  return (
    <Layout>
      <NextSeo
        title="Page Not Found"
        openGraph={{
          title: 'Page Not Found - Resource Rank',
          description: 'This page does not exist.',
        }}
      />
      <div className="text-xl mt-10 text-center">
        Uh-oh! This page does not exist.
      </div>
    </Layout>
  );
}

export default _404_;
