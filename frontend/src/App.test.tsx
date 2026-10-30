import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders DevFlow heading', () => {
    render(<App />);
    expect(screen.getByText('DevFlow')).toBeInTheDocument();
    expect(screen.getByText('Your Projects. Your Team. Your Progress.')).toBeInTheDocument();
  });
});
