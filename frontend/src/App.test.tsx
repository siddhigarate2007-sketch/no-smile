import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('DevFlow Frontend', () => {
  it('renders landing page heading and navigation', () => {
    render(<App />);
    expect(screen.getByText('DevFlow')).toBeInTheDocument();
    expect(
      screen.getByText('DevFlow 1.0 is now live for modern engineering teams')
    ).toBeInTheDocument();
    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
  });
});
