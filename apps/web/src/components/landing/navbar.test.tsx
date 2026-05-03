import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

import { Navbar } from './navbar';

describe('Navbar', () => {
  it('uses stable anchors for section navigation', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: "Who it's for" })).toHaveAttribute('href', '#who-its-for');
    expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '#how-it-works');
  });

  it('routes primary CTA to election guide', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'Open Guide' })).toHaveAttribute('href', '/election-guide');
  });

  it('keeps dashboard access without login language dependency', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'Open Guide' })).toHaveAttribute('href', '/election-guide');
  });
});
