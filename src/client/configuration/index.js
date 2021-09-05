const configuration = {
  GRAPHQL_URL: process.env.NEXT_PUBLIC_GQL_URL,
  HTTP_BASE_URL: `http://${process.env.NEXT_PUBLIC_DOMAIN}`,
  HTTPS_BASE_URL: `https://${process.env.NEXT_PUBLIC_DOMAIN}`,
  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyChFnYmkhARBy0Hwtehlx-81rSC7PZZWT8',
    authDomain: 'resource-rank.firebaseapp.com',
    databaseURL: 'https://resource-rank-default-rtdb.firebaseio.com',
    projectId: 'resource-rank',
    storageBucket: 'resource-rank.appspot.com',
    messagingSenderId: '489304913015',
    appId: '1:489304913015:web:71f38a965ccde83db54272',
    measurementId: 'G-D18DVJ4168',
  },
  USE_AUTHENTICATION_EMULATOR:
    process.env.NEXT_PUBLIC_USE_AUTHENTICATION_EMULATOR === 'true',
  ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
};

export default configuration;
