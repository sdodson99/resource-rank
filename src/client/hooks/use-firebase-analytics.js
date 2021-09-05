import { useEffect, useState } from 'react';
import configuration from '@/configuration/index';
import useFirebaseAppContext from './use-firebase-app-context';

export default function useFirebaseAnalytics() {
  const app = useFirebaseAppContext();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (configuration.ENVIRONMENT === 'production') {
      console.log('Firebase Analytics enabled.');
      setAnalytics(app.analytics());
    }
  }, []);

  return analytics;
}
