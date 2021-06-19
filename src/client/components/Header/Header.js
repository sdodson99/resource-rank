import React, { useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import LoadingButton from '../loading-button';
import Image from 'next/image';
import firebase from 'firebase/app';
import useAuthenticationState from '../../hooks/authentication/use-authentication-state';
import useFirebaseApp from '../../hooks/use-firebase-app';

const Header = () => {
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
    <header className={styles.Header} data-testid="Header">
      <div>
        <div>
          <div>
            <Link href="/">
              <Image
                src="/img/logo.svg"
                alt="Resource Rank Logo"
                height="75"
                width="75"
                priority={true}
              />
            </Link>
          </div>

          <div>
            <Link href="/">Home</Link>
          </div>

          <div>
            <Link href="/topics">Topics</Link>
          </div>

          <div>
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
  );
};

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
