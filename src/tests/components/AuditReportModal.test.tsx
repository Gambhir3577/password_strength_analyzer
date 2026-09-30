import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { AuditReportModal } from '../../components/analyzer/AuditReportModal';
import { analyzePassword } from '../../engine/scoring';
import { evaluateNist80063B } from '../../engine/compliance';

describe('AuditReportModal Component', () => {
  it('renders modal content when open', () => {
    const analysis = analyzePassword('Correct-Horse-Battery-Staple-99');
    const compliance = evaluateNist80063B(analysis);
    const handleClose = vi.fn();

    render(
      <AuditReportModal
        isOpen={true}
        onClose={handleClose}
        analysis={analysis}
        compliance={compliance}
      />
    );

    expect(
      screen.getByText(/Cryptographic Security & Compliance Audit/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Executive Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Markdown Report/i)).toBeInTheDocument();
    expect(screen.getByText(/JSON Schema/i)).toBeInTheDocument();

    // Switch to Markdown tab
    const markdownTab = screen.getByRole('button', { name: /Markdown Report/i });
    fireEvent.click(markdownTab);
    expect(screen.getByText(/Threat Resistance & Crack Times/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /Close modal/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    const analysis = analyzePassword('test');
    const compliance = evaluateNist80063B(analysis);

    const { container } = render(
      <AuditReportModal
        isOpen={false}
        onClose={() => {}}
        analysis={analysis}
        compliance={compliance}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
