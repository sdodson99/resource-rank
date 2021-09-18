import standard from './standard';

export default {
  ...standard,
  authState: {
    isLoggedIn: false,
    currentUser: null,
  },
};
