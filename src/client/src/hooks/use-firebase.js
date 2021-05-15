import { useEffect, useState } from 'react';
import firebase from 'firebase';
import 'firebase/auth';

let firebaseInstance;

function initializeFirebase(firebaseConfig, { useAuthenticationEmulator }) {
  if (typeof window === 'undefined') {
    return null;
  }

  if (firebaseInstance) {
    return firebaseInstance;
  }

  firebaseInstance = firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  if (useAuthenticationEmulator) {
    auth.useEmulator('http://localhost:9099');
  }

  return firebaseInstance;
}

export default function useFirebase(
  firebaseConfig,
  { useAuthenticationEmulator }
) {
  const [firebase, setFirebase] = useState(null);

  useEffect(() => {
    const initializedFirebase = initializeFirebase(firebaseConfig, {
      useAuthenticationEmulator,
    });

    setFirebase(initializedFirebase);
  }, []);

  return firebase;
}
