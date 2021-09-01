import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from 'react';

export default function useRouteLoadingEffect() {
  const router = useRouter();

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
    });
  }, []);

  useEffect(() => {
    router.events.on('routeChangeStart', NProgress.start);

    return () => {
      router.events.off('routeChangeStart', NProgress.start);
    };
  }, []);

  useEffect(() => {
    router.events.on('routeChangeComplete', NProgress.done);

    return () => {
      router.events.off('routeChangeComplete', NProgress.done);
    };
  }, []);
}
