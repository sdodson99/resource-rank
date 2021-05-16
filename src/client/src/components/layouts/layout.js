import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { Alert, Spinner } from 'react-bootstrap';
import * as layoutStyle from './layout.module.css';
import logo from '../../assets/logo.svg';
import useReadOnlyModeStatus from '../../hooks/use-read-only-mode-status';
import firebase from 'firebase';
import useAuthenticationState from '../../hooks/authentication/use-authentication-state';
import useFirebaseApp from '../../hooks/use-firebase-app';

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
      {readOnlyModeEnabled && (
        <Alert className="mb-0 text-center" variant="warning">
          Application is in read-only mode.
        </Alert>
      )}
      <header className="py-3">
        <div className={`container ${layoutStyle.container}`}>
          <div className="row align-items-center text-center text-sm-start">
            <div className="col-sm ">
              <Link to="/" className={layoutStyle.title}>
                <img
                  className={layoutStyle.logo}
                  src={logo}
                  alt="Resource Rank Logo"
                />
              </Link>
            </div>

            <div className="col-sm-auto mt-3 mt-sm-0">
              <Link
                to="/"
                className={layoutStyle.link}
                activeClassName={layoutStyle.active}
              >
                Topics
              </Link>
            </div>

            <div className="col-sm-auto mt-3 mt-sm-0">
              {!isLoggedIn && (
                <button className="btn btn-primary" onClick={onLoginClick}>
                  {isLoggingIn && (
                    <Spinner size="sm" animation="border" role="status" />
                  )}
                  {!isLoggingIn && <span>Login</span>}
                </button>
              )}
              {isLoggedIn && (
                <button className="btn btn-primary" onClick={onLogoutClick}>
                  {isLoggingOut && (
                    <Spinner size="sm" animation="border" role="status" />
                  )}
                  {!isLoggingOut && <span>Logout</span>}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className={`py-4 container ${layoutStyle.container}`}>
        {children}
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
