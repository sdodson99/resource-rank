import firebase from 'firebase/app';
import 'firebase/auth';

let firebaseInstance;

export default function initialize(
  firebaseConfig,
  { useAuthenticationEmulator }
) {
  if (firebaseInstance) {
    return firebaseInstance;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  firebaseInstance = firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  if (useAuthenticationEmulator) {
    auth.useEmulator('http://localhost:9099');
  }

  return firebaseInstance;
}
