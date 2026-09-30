import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { GeneratorView } from '../../components/generator/GeneratorView';

describe('GeneratorView Component', () => {
  it('renders passphrase generator options by default', () => {
    render(<GeneratorView onSelectPassword={() => {}} />);
    expect(screen.getByText(/Secure Password & Passphrase Generator/i)).toBeInTheDocument();
    expect(screen.getByText('Word Count')).toBeInTheDocument();
    expect(screen.getByText(/Word Separator/i)).toBeInTheDocument();
  });

  it('switches between Passphrase and Random Character mode', async () => {
    const user = userEvent.setup();
    render(<GeneratorView onSelectPassword={() => {}} />);

    const randomModeBtn = screen.getByRole('button', { name: /Random Character Password/i });
    await user.click(randomModeBtn);

    expect(screen.getByText('Password Length')).toBeInTheDocument();
    expect(screen.getByText(/Exclude Ambiguous Characters/i)).toBeInTheDocument();
  });
});
