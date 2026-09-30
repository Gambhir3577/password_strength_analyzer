import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ComplianceChecklist } from '../../components/analyzer/ComplianceChecklist';
import { analyzePassword } from '../../engine/scoring';

describe('ComplianceChecklist Component', () => {
  it('renders compliance standards and allows switching standards', () => {
    const analysis = analyzePassword('P@ssw0rd123456!');
    render(<ComplianceChecklist analysis={analysis} />);

    expect(screen.getByText(/Compliance & Security Policy Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/NIST 800-63B/i)).toBeInTheDocument();
    expect(screen.getByText(/PCI-DSS v4.0/i)).toBeInTheDocument();

    // Switch to PCI-DSS
    const pciButton = screen.getByRole('button', { name: /PCI-DSS v4.0/i });
    fireEvent.click(pciButton);

    expect(screen.getByText(/Payment Card Industry Security Standards Council/i)).toBeInTheDocument();
  });

  it('displays rule details when expanded', () => {
    const analysis = analyzePassword('pass');
    render(<ComplianceChecklist analysis={analysis} />);

    const minLengthRule = screen.getByText('Minimum 8 Characters');
    fireEvent.click(minLengthRule);

    expect(screen.getByText(/NIST Section 5.1.1.2 requires memorized secrets/i)).toBeInTheDocument();
  });
});
