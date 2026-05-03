import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

let selectedLocale: 'en' | 'hi' = 'en';

vi.mock('@/lib/onboarding-store', () => ({
  useOnboardingStore: (selector: (state: { selectedLocale: 'en' | 'hi' }) => unknown) =>
    selector({ selectedLocale }),
}));

import { Navbar } from './navbar';

describe('Navbar', () => {
  it('uses stable anchors for section navigation', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: "Who it's for" })).toHaveAttribute('href', '#who-its-for');
    expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '#how-it-works');
  });

  it('routes sign in to localized dashboard path', () => {
    selectedLocale = 'en';
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/en/dashboard');
  });

  it('uses selected locale for sign-in route', () => {
    selectedLocale = 'hi';
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/hi/dashboard');
  });
});
