import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import * as layoutStyle from './layout.module.css';
import useReadOnlyModeStatus from '../../hooks/use-read-only-mode-status';
import firebase from 'firebase/app';
import useAuthenticationState from '../../hooks/authentication/use-authentication-state';
import useFirebaseApp from '../../hooks/use-firebase-app';
import LoadingButton from '../loading-button';
import Footer from './footer';
import Image from 'next/image';

function Layout({ children }) {
  const readOnlyModeEnabled = useReadOnlyModeStatus();
  const firebaseApp = useFirebaseApp();
  const { isLoggedIn } = useAuthenticationState();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLoginClick = async () => {
    setIsLoggingIn(true);

    try {
      const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

      await firebaseApp.auth().signInWithPopup(googleAuthProvider);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onLogoutClick = async () => {
    setIsLoggingOut(true);

    try {
      await firebaseApp.auth().signOut();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      <div className={layoutStyle.page}>
        {readOnlyModeEnabled && (
          <div className="mb-0 text-center">
            Application is in read-only mode.
          </div>
        )}
        <header className="py-3">
          <div className="container">
            <div className="row align-items-center text-center text-sm-start">
              <div className="col-sm ">
                <Link href="/" className={layoutStyle.title}>
                  <Image
                    src="/img/logo.svg"
                    alt="Resource Rank Logo"
                    height="75"
                    width="75"
                  />
                </Link>
              </div>

              <div className="col-sm-auto mt-3 mt-sm-0">
                <Link
                  href="/"
                  className={layoutStyle.link}
                  activeClassName={layoutStyle.active}
                >
                  Home
                </Link>
              </div>

              <div className="col-sm-auto mt-3 mt-sm-0">
                <Link
                  href="/topics"
                  className={layoutStyle.link}
                  activeClassName={layoutStyle.active}
                >
                  Topics
                </Link>
              </div>

              <div className="col-sm-auto mt-3 mt-sm-0">
                {!isLoggedIn && (
                  <LoadingButton
                    isLoading={isLoggingIn}
                    variant="primary"
                    onClick={onLoginClick}
                  >
                    Login
                  </LoadingButton>
                )}
                {isLoggedIn && (
                  <LoadingButton
                    isLoading={isLoggingOut}
                    variant="primary"
                    onClick={onLogoutClick}
                  >
                    Logout
                  </LoadingButton>
                )}
              </div>
            </div>
          </div>
        </header>
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
