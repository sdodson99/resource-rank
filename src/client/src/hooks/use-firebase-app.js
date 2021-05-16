import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';

const FirebaseAppContext = createContext();

function FirebaseAppProvider({
  children,
  firebaseConfig,
  useAuthenticationEmulator,
}) {
  const [firebaseApp, setFirebaseApp] = useState(null);

  useEffect(() => {
    const initializedFirebaseApp = firebase.initializeApp(firebaseConfig);

    const auth = initializedFirebaseApp.auth();
    if (useAuthenticationEmulator) {
      auth.useEmulator('http://localhost:9099');
    }

    setFirebaseApp(initializedFirebaseApp);
  }, []);

  return (
    <FirebaseAppContext.Provider value={firebaseApp}>
      {children}
    </FirebaseAppContext.Provider>
  );
}

FirebaseAppProvider.propTypes = {
  children: PropTypes.node,
  firebaseConfig: PropTypes.object,
  useAuthenticationEmulator: PropTypes.bool,
};

export { FirebaseAppProvider };

export default () => useContext(FirebaseAppContext);
