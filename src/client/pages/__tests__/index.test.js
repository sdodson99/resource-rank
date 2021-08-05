import 'regenerator-runtime';
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Home from '../index.page';

describe('<Home />', () => {
  it('should render correctly', () => {
    const page = createRenderer().render(<Home />);

    expect(page).toMatchSnapshot();
  });
});
