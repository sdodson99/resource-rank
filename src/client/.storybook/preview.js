import '../styles/globals.css';
import { MockProvider } from '../hooks/use-mock-context';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <div className="p-5" style={{ fontFamily: 'Kanit, sans-serif' }}>
      <MockProvider>
        <Story />
      </MockProvider>
    </div>
  ),
];
