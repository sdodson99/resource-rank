import 'regenerator-runtime';
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import __404__ from './404';

describe('404 page', () => {
  it('should render correctly', () => {
    const page = createRenderer().render(<__404__ />);

    expect(page).toMatchSnapshot();
  });
});
