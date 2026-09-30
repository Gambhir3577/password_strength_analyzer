import { describe, it, expect } from 'vitest';
import { analyzePassword } from '../../engine/scoring';
import { evaluateNist80063B } from '../../engine/compliance';
import {
  generateAuditJson,
  generateAuditMarkdown,
} from '../../services/auditExportService';

describe('Audit Export Service', () => {
  it('generates sanitized JSON audit report without exposing raw secrets', () => {
    const rawSecret = 'MySuperSecretP@ssw0rd2024!';
    const analysis = analyzePassword(rawSecret);
    const compliance = evaluateNist80063B(analysis);

    const jsonReport = generateAuditJson(analysis, compliance);

    expect(jsonReport.reportId).toMatch(/^CPG-/);
    expect(jsonReport.metrics.passwordLength).toBe(rawSecret.length);
    expect(jsonReport.metrics.entropyBits).toBeGreaterThan(0);
    expect(jsonReport.compliance.standard).toBe('NIST SP 800-63B');

    // Crucial: The serialized JSON MUST NEVER contain the raw password string
    const serialized = JSON.stringify(jsonReport);
    expect(serialized).not.toContain(rawSecret);
  });

  it('generates formatted Markdown report with threat matrix and compliance', () => {
    const rawSecret = 'Tr0ub4dor&3!';
    const analysis = analyzePassword(rawSecret);
    const compliance = evaluateNist80063B(analysis);

    const markdown = generateAuditMarkdown(analysis, compliance);

    expect(markdown).toContain('# 🛡️ CipherGuard Security Audit Report');
    expect(markdown).toContain('Threat Resistance & Crack Times');
    expect(markdown).toContain('NIST SP 800-63B');
    expect(markdown).not.toContain(rawSecret);
  });
});
