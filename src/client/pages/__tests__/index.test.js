import 'regenerator-runtime';
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Index from '../index.page';

describe('home page', () => {
  it('should render correctly', () => {
    const page = createRenderer().render(<Index />);

    expect(page).toMatchSnapshot();
  });
});
