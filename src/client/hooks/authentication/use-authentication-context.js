import { useEffect, useState } from 'react';
import useFirebaseApp from '../use-firebase-app';
import constate from 'constate';

function useAuthentication() {
  const firebaseApp = useFirebaseApp();
  const [authenticationState, setAuthenticationState] = useState({
    isLoggedIn: false,
    currentUser: null,
  });

  useEffect(() => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged((user) => {
      const isLoggedIn = !!user;

      setAuthenticationState({
        isLoggedIn,
        currentUser: user,
      });
    });

    return () => unsubscribe();
  }, []);

  return authenticationState;
}

const [AuthenticationProvider, useAuthenticationContext] =
  constate(useAuthentication);

export { AuthenticationProvider };
export default useAuthenticationContext;
