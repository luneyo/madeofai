import { render, screen } from '@testing-library/react';
import App from './App';

// Mock dependencies
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mock child components to avoid ESM issues with d3/framer-motion during tests
jest.mock('./components/InteractiveWordCloud', () => function DummyWordCloud() {
  return <div data-testid="wordcloud">WordCloud</div>;
});

jest.mock('./components/InsightsGrid', () => function DummyInsightsGrid() {
  return <div data-testid="insights">Insights</div>;
});

test('renders RedditReader title', () => {
  render(<App />);
  // Use getByRole which is more accessible and handles children text aggregation better usually,
  // or just check for the main text parts.
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toHaveTextContent('RedditReader');
});
