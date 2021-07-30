import { useEffect, useState } from 'react';
import useFirebaseAppContext from './use-firebase-app-context';
import constate from 'constate';

export function useAuthentication() {
  const firebaseApp = useFirebaseAppContext();
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
