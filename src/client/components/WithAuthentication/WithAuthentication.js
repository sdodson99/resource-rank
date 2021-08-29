import useAuthenticationContext from '@/hooks/use-authentication-context';
import React from 'react';
import Layout from '../Layout/Layout';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const withAuthentication = (Component) =>
  function Authentication(props) {
    const { initialized, isLoggedIn } = useAuthenticationContext();

    if (!initialized) {
      return (
        <Layout>
          <LoadingSpinner />
        </Layout>
      );
    }

    if (!isLoggedIn) {
      return (
        <Layout>
          <div>You must login to view this page.</div>
        </Layout>
      );
    }

    return <Component {...props} />;
  };

export default withAuthentication;
