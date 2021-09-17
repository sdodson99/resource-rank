import { useEffect, useState } from 'react';
import useFirebaseAppContext from './use-firebase-app-context';
import constate from 'constate';
import useMockContext from './use-mock-context';
import mocks from '../mocks';

export function useAuthentication() {
  const firebaseApp = useFirebaseAppContext();
  const [authenticationState, setAuthenticationState] = useState({
    isLoggedIn: false,
    currentUser: null,
    initialized: false,
  });
  const mock = useMockContext();

  useEffect(() => {
    if (mock) {
      const authState = mocks[mock]?.authState ?? mocks['standard'].authState;

      return setAuthenticationState({
        ...authState,
        initialized: true,
      });
    }

    const unsubscribe = firebaseApp.auth().onAuthStateChanged((user) => {
      const isLoggedIn = !!user;

      setAuthenticationState({
        isLoggedIn,
        currentUser: user,
        initialized: true,
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
