import { useRouter } from 'next/router';

jest.mock('next/router');

beforeEach(() => {
  useRouter.mockReturnValue({});
});

afterEach(() => {
  useRouter.mockReset();
});
