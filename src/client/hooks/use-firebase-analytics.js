import useFirebaseAppContext from './use-firebase-app-context';

export default function useFirebaseAnalytics() {
  const app = useFirebaseAppContext();

  return app.analytics();
}
