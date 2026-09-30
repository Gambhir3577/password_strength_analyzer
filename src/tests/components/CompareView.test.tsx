import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { CompareView } from '../../components/compare/CompareView';

describe('CompareView Component', () => {
  it('renders dual password inputs and shows comparison verdict', () => {
    render(<CompareView />);
    expect(screen.getByText('Compare Password Strength')).toBeInTheDocument();
    expect(screen.getByText('Password Candidate A')).toBeInTheDocument();
    expect(screen.getByText('Password Candidate B')).toBeInTheDocument();
    expect(screen.getByText(/Security Comparison Verdict/i)).toBeInTheDocument();
  });

  it('updates comparative metrics when typing in candidate fields', async () => {
    const user = userEvent.setup();
    render(<CompareView />);

    const inputs = screen.getAllByPlaceholderText('Type or paste password here...');
    expect(inputs.length).toBe(2);

    await user.clear(inputs[0]);
    await user.type(inputs[0], '123456');

    expect(screen.getByText(/Password B is significantly stronger/i)).toBeInTheDocument();
  });
});
