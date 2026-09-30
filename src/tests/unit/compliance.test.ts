import { describe, it, expect } from 'vitest';
import { analyzePassword } from '../../engine/scoring';
import {
  evaluateNist80063B,
  evaluatePciDssV4,
  evaluateCisEnterprise,
  evaluateOwaspAsvs,
  evaluateCustomPolicy,
} from '../../engine/compliance';

describe('Compliance Engine', () => {
  it('evaluates weak passwords as non-compliant under NIST SP 800-63B', () => {
    const analysis = analyzePassword('pass');
    const result = evaluateNist80063B(analysis);

    expect(result.isCompliant).toBe(false);
    expect(result.rules.find((r) => r.id === 'nist-min-length')?.status).toBe('fail');
  });

  it('evaluates strong Diceware passphrases as compliant under NIST SP 800-63B', () => {
    const analysis = analyzePassword('correct horse battery staple');
    const result = evaluateNist80063B(analysis);

    expect(result.isCompliant).toBe(true);
    expect(result.scorePercentage).toBeGreaterThanOrEqual(80);
  });

  it('enforces alphanumeric requirement under PCI-DSS v4.0', () => {
    const purelyAlpha = analyzePassword('allalphabetsonlyhere');
    const pciResultAlpha = evaluatePciDssV4(purelyAlpha);
    expect(pciResultAlpha.rules.find((r) => r.id === 'pci-alphanumeric')?.status).toBe('fail');

    const alphaNumeric = analyzePassword('K9xP4mQ7vL2wZ8!r');
    const pciResultValid = evaluatePciDssV4(alphaNumeric);
    expect(pciResultValid.rules.find((r) => r.id === 'pci-alphanumeric')?.status).toBe('pass');
    expect(pciResultValid.isCompliant).toBe(true);
  });

  it('evaluates CIS Enterprise complexity requirement', () => {
    const simple = analyzePassword('password123456');
    const cisResult = evaluateCisEnterprise(simple);
    expect(cisResult.isCompliant).toBe(false);

    const complex = analyzePassword('K8$mP#9qWz2!vL7@');
    const cisResultComplex = evaluateCisEnterprise(complex);
    expect(cisResultComplex.isCompliant).toBe(true);
  });

  it('evaluates OWASP ASVS with user context collision', () => {
    const contextAnalysis = analyzePassword('AliceSecret2024!', { name: 'Alice' });
    const owaspResult = evaluateOwaspAsvs(contextAnalysis);
    expect(owaspResult.rules.find((r) => r.id === 'owasp-context')?.status).toBe('fail');
  });

  it('allows custom policy configuration', () => {
    const analysis = analyzePassword('short');
    const customResult = evaluateCustomPolicy(analysis, {
      minLength: 16,
      requireLowercase: true,
      requireUppercase: true,
      requireDigits: true,
      requireSymbols: true,
      disallowSequences: true,
      disallowRepeats: true,
      disallowCommonWords: true,
      minEntropyBits: 70,
    });

    expect(customResult.isCompliant).toBe(false);
    expect(customResult.rules.find((r) => r.id === 'custom-length')?.status).toBe('fail');
  });
});
