import { createRef } from 'react';
import { useIntersectionObserver } from 'react-intersection-observer-hook';

jest.mock('react-intersection-observer-hook');

beforeEach(() => {
  useIntersectionObserver.mockReturnValue([createRef(), {}]);
});

afterEach(() => {
  useIntersectionObserver.mockReset();
});
