import { useRouter } from 'next/router';
import useMockContext from './use-mock-context';

export default function useNavigate() {
  const router = useRouter();
  const mock = useMockContext();

  const getUrl = (url) => {
    if (!mock) {
      return url;
    }

    return {
      ...url,
      query: {
        ...url.query,
        mock,
      },
    };
  };

  const navigate = async (url) => {
    await router.push(getUrl(url));
  };

  return navigate;
}
