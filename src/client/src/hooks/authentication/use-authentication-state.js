import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useFirebaseApp from '../use-firebase-app';

const AuthenticationContext = createContext({
  isLoggedIn: false,
  currentUser: null,
});

const AuthenticationProvider = ({ children }) => {
  const firebaseApp = useFirebaseApp();
  const [authenticationState, setAuthenticationState] = useState({
    isLoggedIn: false,
    currentUser: null,
  });

  useEffect(() => {
    if (!firebaseApp) {
      return;
    }

    const unsubscribe = firebaseApp.auth().onAuthStateChanged((user) => {
      const isLoggedIn = !!user;

      setAuthenticationState({
        isLoggedIn,
        currentUser: user,
      });
    });

    return () => unsubscribe();
  }, [firebaseApp]);

  return (
    <AuthenticationContext.Provider value={authenticationState}>
      {children}
    </AuthenticationContext.Provider>
  );
};

AuthenticationProvider.propTypes = {
  children: PropTypes.node,
  firebaseApp: PropTypes.object,
};

export { AuthenticationProvider };

export default () => useContext(AuthenticationContext);
