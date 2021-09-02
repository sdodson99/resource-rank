import constate from 'constate';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';

export function useFirebaseApp({ firebaseConfig, useAuthenticationEmulator }) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();
    if (useAuthenticationEmulator) {
      auth.useEmulator('http://localhost:9099');
    }
  }

  return firebase;
}

const [FirebaseAppProvider, useFirebaseAppContext] = constate(useFirebaseApp);

export { FirebaseAppProvider };
export default useFirebaseAppContext;
