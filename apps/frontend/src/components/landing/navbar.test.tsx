import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Navbar } from './navbar';

describe('Navbar', () => {
  it('uses stable anchors for section navigation', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: "Who it's for" })).toHaveAttribute('href', '#who-its-for');
    expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '#how-it-works');
  });

  it('routes sign in to dashboard instead of hash link', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/dashboard');
  });
});
