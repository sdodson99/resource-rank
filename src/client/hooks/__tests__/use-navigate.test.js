import { useRouter } from 'next/router';
import useMockContext from '../use-mock-context';
import useNavigate from '../use-navigate';

jest.mock('next/router');
jest.mock('../use-mock-context');

describe('useNavigate', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    useRouter.mockReset();
    useMockContext.mockReset();
  });

  it('should navigate to url if no mock provided', () => {
    const url = { pathname: '/page' };

    const navigate = useNavigate();
    navigate(url);

    expect(mockRouter.push).toBeCalledWith(url);
  });

  it('should navigate to url with mock if mock provided', () => {
    const mock = 'default';
    useMockContext.mockReturnValue(mock);

    const navigate = useNavigate();
    navigate({ pathname: '/page', query: { search: 'test' } });

    expect(mockRouter.push).toBeCalledWith({
      pathname: '/page',
      query: { search: 'test', mock },
    });
  });
});
