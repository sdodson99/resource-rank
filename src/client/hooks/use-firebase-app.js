import { useEffect, useState } from 'react';
import constate from 'constate';
import firebase from 'firebase/app';
import 'firebase/auth';

function useFirebaseApp({ firebaseConfig, useAuthenticationEmulator }) {
  const [firebaseApp, setFirebaseApp] = useState(null);

  useEffect(() => {
    const initializedFirebaseApp = firebase.initializeApp(firebaseConfig);

    const auth = initializedFirebaseApp.auth();
    if (useAuthenticationEmulator) {
      auth.useEmulator('http://localhost:9099');
    }

    setFirebaseApp(initializedFirebaseApp);
  }, []);

  return firebaseApp;
}

const [FirebaseAppProvider, useFirebaseAppContext] = constate(useFirebaseApp);

export { FirebaseAppProvider };
export default useFirebaseAppContext;
