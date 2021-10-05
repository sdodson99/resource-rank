import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Layout from './Layout';
import withApp from '@/test-utils/with-app';
import useFeatureFlagsContext from '@/hooks/use-feature-flags-context';
import renderer from 'react-test-renderer';
import { when } from 'jest-when';

jest.mock('@/hooks/use-feature-flags-context', () => ({
  ...jest.requireActual('@/hooks/use-feature-flags-context'),
  __esModule: true,
  default: jest.fn(),
}));

describe('<Layout />', () => {
  let mockIsFeatureFlagEnabled;

  beforeEach(() => {
    mockIsFeatureFlagEnabled = jest.fn();
    useFeatureFlagsContext.mockReturnValue({
      isEnabled: mockIsFeatureFlagEnabled,
    });
  });

  afterEach(() => {
    useFeatureFlagsContext.mockReset();
  });

  it('should mount', () => {
    render(withApp(Layout));

    const layout = screen.getByTestId('Layout');

    expect(layout).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const component = renderer
      .create(withApp(Layout, { children: 'Hello world.' }))
      .toJSON();

    expect(component).toMatchSnapshot();
  });

  it('should show read-only mode alert if read only mode enabled', () => {
    when(mockIsFeatureFlagEnabled)
      .calledWith('read_only_mode')
      .mockReturnValue(true);
    render(withApp(Layout));

    const readOnlyModeAlert = screen.getByText(
      'Application is in read-only mode.'
    );

    expect(readOnlyModeAlert).toBeInTheDocument();
  });

  it('should not show read-only mode alert if read only mode disabled', () => {
    when(mockIsFeatureFlagEnabled)
      .calledWith('read_only_mode')
      .mockReturnValue(false);
    render(withApp(Layout));

    const readOnlyModeAlert = screen.queryByText(
      'Application is in read-only mode.'
    );

    expect(readOnlyModeAlert).toBeNull();
  });
});
