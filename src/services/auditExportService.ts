import type { PasswordAnalysisResult } from '../types/analyzer';
import type { ComplianceStandardResult } from '../types/compliance';

export interface AuditJsonReport {
  reportId: string;
  generatedAt: string;
  tool: {
    name: string;
    version: string;
    runtime: string;
    privacyGuarantee: string;
  };
  metrics: {
    passwordLength: number;
    score: number;
    level: string;
    entropyBits: number;
    characterPoolSize: number;
    analysisTimeMs: number;
  };
  crackTimes: {
    scenario: string;
    label: string;
    ratePerSecond: number;
    estimatedTimeToCrack: string;
  }[];
  vulnerabilities: {
    id: string;
    type: string;
    severity: string;
    description: string;
  }[];
  compliance: {
    standard: string;
    organization: string;
    version: string;
    isCompliant: boolean;
    complianceScore: number;
    rules: {
      name: string;
      status: string;
      details?: string;
      remediation?: string;
    }[];
  };
  recommendations: string[];
}

/**
 * Creates a sanitized, zero-plaintext JSON security audit report.
 */
export function generateAuditJson(
  analysis: PasswordAnalysisResult,
  compliance: ComplianceStandardResult
): AuditJsonReport {
  const reportId = `CPG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return {
    reportId,
    generatedAt: new Date().toISOString(),
    tool: {
      name: 'CipherGuard Password Threat Analyzer',
      version: '1.0.0',
      runtime: 'Client-Side Web Crypto API & zxcvbn-ts',
      privacyGuarantee: 'Zero server telemetry, Zero plaintext transmission or storage.',
    },
    metrics: {
      passwordLength: analysis.passwordLength,
      score: analysis.score,
      level: analysis.level,
      entropyBits: analysis.entropyBits,
      characterPoolSize: analysis.variety.poolSize,
      analysisTimeMs: analysis.analysisTimeMs,
    },
    crackTimes: analysis.crackTimes.map((ct) => ({
      scenario: ct.scenario,
      label: ct.label,
      ratePerSecond: ct.guessesPerSecond,
      estimatedTimeToCrack: ct.displayTime,
    })),
    vulnerabilities: analysis.patterns.map((p) => ({
      id: p.id,
      type: p.type,
      severity: p.severity,
      description: p.description,
    })),
    compliance: {
      standard: compliance.name,
      organization: compliance.organization,
      version: compliance.version,
      isCompliant: compliance.isCompliant,
      complianceScore: compliance.scorePercentage,
      rules: compliance.rules.map((r) => ({
        name: r.name,
        status: r.status,
        details: r.details,
        remediation: r.remediation,
      })),
    },
    recommendations: analysis.feedback.suggestions,
  };
}

/**
 * Generates a formatted Markdown report for DevSecOps records and documentation.
 */
export function generateAuditMarkdown(
  analysis: PasswordAnalysisResult,
  compliance: ComplianceStandardResult
): string {
  const dateStr = new Date().toUTCString();
  const reportId = `CPG-${Date.now().toString(36).toUpperCase()}`;

  return `# 🛡️ CipherGuard Security Audit Report
**Report ID:** \`${reportId}\`  
**Generated At:** ${dateStr}  
**Audit Standard:** ${compliance.name} (${compliance.version})  
**Privacy Assurance:** *Evaluated 100% client-side via Web Crypto API. Plaintext secret is never stored or transmitted.*

---

## 📊 Summary Scorecard

| Metric | Evaluation |
| :--- | :--- |
| **Overall Strength Level** | **${analysis.level.toUpperCase()}** (${analysis.score}/4) |
| **Shannon Entropy** | **${analysis.entropyBits} bits** |
| **Character Length** | ${analysis.passwordLength} characters |
| **Character Pool Size (R)** | ${analysis.variety.poolSize} characters |
| **Compliance Status** | ${compliance.isCompliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'} (${compliance.scorePercentage}%) |
| **Vulnerabilities Found** | ${analysis.patterns.length} pattern(s) |

---

## ⚡ Threat Resistance & Crack Times

| Attack Vector | Guess Rate | Estimated Crack Time |
| :--- | :--- | :--- |
${analysis.crackTimes
  .map(
    (c) =>
      `| **${c.label}** | ${c.guessesPerSecond.toLocaleString()} / sec | \`${c.displayTime}\` |`
  )
  .join('\n')}

---

## 📋 Compliance Audit: ${compliance.name}

${compliance.rules
  .map((r) => {
    const icon = r.status === 'pass' ? '✅' : r.status === 'warning' ? '⚠️' : '❌';
    return `### ${icon} ${r.name} (\`${r.status.toUpperCase()}\`)
- **Requirement:** ${r.description}
- **Assessment:** ${r.details || 'Evaluated'}
${r.remediation ? `- **Remediation:** ${r.remediation}` : ''}`;
  })
  .join('\n\n')}

---

## 🔍 Matched Vulnerabilities & Structural Patterns

${
  analysis.patterns.length === 0
    ? '*No known structural vulnerabilities or dictionary matches detected.*'
    : analysis.patterns
        .map(
          (p) =>
            `- **[${p.severity.toUpperCase()}] ${p.type}**: ${p.description}`
        )
        .join('\n')
}

---

## 💡 Remediation Guidance

${
  analysis.feedback.suggestions.length === 0
    ? '*Current secret configuration satisfies security best practices.*'
    : analysis.feedback.suggestions.map((s) => `- ${s}`).join('\n')
}

---
*Generated securely by CipherGuard Zero-Telemetry Engine.*
`;
}

/**
 * Triggers a client-side file download.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
