import React from 'react';
import App from '../_app.page';
import { createRenderer } from 'react-test-renderer/shallow';
import { useRouter } from 'next/router';

jest.mock('next/router');

describe('<App />', () => {
  let Component;

  beforeEach(() => {
    Component = function MockComponent() {
      return <div>Test component</div>;
    };
  });

  afterEach(() => {
    useRouter.mockReset();
  });

  it('should render correctly', () => {
    useRouter.mockReturnValue({ asPath: '/path' });

    const page = createRenderer().render(<App Component={Component} />);

    expect(page).toMatchSnapshot();
  });
});
