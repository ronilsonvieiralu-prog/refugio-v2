import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header with Refúgio branding', () => {
  render(<App />);
  const heading = screen.getAllByText(/Refúgio/i);
  expect(heading.length).toBeGreaterThan(0);
});

test('renders navigation links', () => {
  render(<App />);
  expect(screen.getByText(/Início/i)).toBeInTheDocument();
  // Multiple "Listagens" elements are expected (nav + home page)
  expect(screen.getAllByText(/Listagens/i).length).toBeGreaterThan(0);
  // Multiple "Pedir Ajuda" and "Oferecer Ajuda" expected (nav + home page)
  expect(screen.getAllByText(/Pedir Ajuda/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Oferecer Ajuda/i).length).toBeGreaterThan(0);
});

test('renders home page hero text', () => {
  render(<App />);
  expect(screen.getAllByText(/Juntos somos mais fortes/i).length).toBeGreaterThan(0);
});


