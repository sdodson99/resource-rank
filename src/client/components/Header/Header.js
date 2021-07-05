import React, { useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import LoadingButton from '../LoadingButton/LoadingButton';
import Image from 'next/image';
import firebase from 'firebase/app';
import useAuthenticationContext from '../../hooks/authentication/use-authentication-context';
import useFirebaseApp from '../../hooks/use-firebase-app';
import ActiveLink from '../ActiveLink/ActiveLink';

const Header = () => {
  const firebaseApp = useFirebaseApp();
  const { isLoggedIn } = useAuthenticationContext();
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
      <div className="content-container">
        <div className="sm:flex items-center text-center sm:text-left">
          <div className="flex-grow">
            <Link href="/">
              <a>
                <Image
                  src="/img/logo.svg"
                  alt="Resource Rank Logo"
                  height="50"
                  width="50"
                  layout="fixed"
                  priority={true}
                />
              </a>
            </Link>
          </div>

          <ActiveLink
            href="/"
            className={`${styles.NavItem} ${styles.NavLink}`}
            activeClassName={styles.ActiveNavLink}
          >
            <a>Home</a>
          </ActiveLink>

          <ActiveLink
            href="/topics"
            className={`${styles.NavItem} ${styles.NavLink}`}
            activeClassName={styles.ActiveNavLink}
          >
            <a>Topics</a>
          </ActiveLink>

          <div className={styles.NavItem}>
            {!isLoggedIn && (
              <LoadingButton isLoading={isLoggingIn} onClick={onLoginClick}>
                Login
              </LoadingButton>
            )}
            {isLoggedIn && (
              <LoadingButton isLoading={isLoggingOut} onClick={onLogoutClick}>
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
