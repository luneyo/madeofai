import { render, screen } from '@testing-library/react';
import App from './App';

// Mock dependencies to avoid ESM/syntax issues in Jest
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
}));
jest.mock('wordcloud', () => jest.fn());

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/RedditReader/i);
  expect(linkElement).toBeInTheDocument();
});
