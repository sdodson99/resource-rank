import { useEffect, useState } from 'react';
import useFirebaseAppContext from './use-firebase-app-context';

export default function useFirebaseAnalytics() {
  const app = useFirebaseAppContext();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    setAnalytics(app.analytics());
  }, []);

  return analytics;
}
