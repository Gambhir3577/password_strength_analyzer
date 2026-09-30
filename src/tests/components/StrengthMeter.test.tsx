import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { StrengthMeter } from '../../components/analyzer/StrengthMeter';

describe('StrengthMeter Component', () => {
  it('renders awaiting input state when length is 0', () => {
    render(<StrengthMeter score={0} level="Very Weak" passwordLength={0} />);
    expect(screen.getByText('Awaiting Input')).toBeInTheDocument();
    expect(screen.getByText('0/4')).toBeInTheDocument();
  });

  it('renders correct level and updates live announcement region', () => {
    const { rerender } = render(<StrengthMeter score={1} level="Weak" passwordLength={6} />);
    expect(screen.getByText('Weak')).toBeInTheDocument();
    expect(screen.getByText('1/4')).toBeInTheDocument();

    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toHaveTextContent('Password strength evaluated as Weak, score 1 out of 4');

    rerender(<StrengthMeter score={4} level="Very Strong" passwordLength={16} />);
    expect(screen.getByText('Very Strong')).toBeInTheDocument();
    expect(screen.getByText('4/4')).toBeInTheDocument();
    expect(statusRegion).toHaveTextContent('Password strength evaluated as Very Strong, score 4 out of 4');
  });
});
