import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

const AuthenticationContext = createContext({
  isLoggedIn: false,
  currentUser: null,
});

export const useAuthenticationState = () => useContext(AuthenticationContext);

const AuthenticationProvider = ({ children, firebaseApp }) => {
  const [authenticationState, setAuthenticationState] = useState({
    isLoggedIn: false,
    currentUser: null,
  });

  useEffect(() => {
    const unsubscribe = firebase
      .auth(firebaseApp)
      .onAuthStateChanged((user) => {
        const isLoggedIn = !!user;

        setAuthenticationState({
          isLoggedIn,
          currentUser: user,
        });
      });

    return () => unsubscribe();
  }, []);

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
