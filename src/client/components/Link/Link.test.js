import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createRenderer } from 'react-test-renderer/shallow';
import Link from './Link';
import useMockContext from '@/hooks/use-mock-context';

jest.mock('@/hooks/use-mock-context');

describe('<Link />', () => {
  let props;

  beforeEach(() => {
    props = {
      url: {
        pathname: 'test',
      },
      children: 'Click me',
    };
  });

  afterEach(() => {
    useMockContext.mockReset();
  });

  it('should mount', () => {
    render(<Link {...props} />);

    const link = screen.getByTestId('Link');

    expect(link).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = createRenderer().render(<Link {...props} />);

    expect(component).toMatchSnapshot();
  });

  it('should render correctly with mock', () => {
    props.url.query = { other: 'value' };
    useMockContext.mockReturnValue('mock1');

    const component = createRenderer().render(<Link {...props} />);

    expect(component).toMatchSnapshot();
  });
});
