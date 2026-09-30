export type ComplianceStandardId = 
  | 'nist_800_63b' 
  | 'pci_dss_v4' 
  | 'cis_enterprise' 
  | 'owasp_asvs' 
  | 'custom';

export type RuleStatus = 'pass' | 'fail' | 'warning';

export interface ComplianceRuleResult {
  id: string;
  name: string;
  description: string;
  rationale: string;
  status: RuleStatus;
  details?: string;
  remediation?: string;
}

export interface ComplianceStandardResult {
  id: ComplianceStandardId;
  name: string;
  organization: string;
  summary: string;
  version: string;
  isCompliant: boolean;
  scorePercentage: number;
  passedCount: number;
  totalCount: number;
  rules: ComplianceRuleResult[];
}

export interface CustomPolicyConfig {
  minLength: number;
  requireLowercase: boolean;
  requireUppercase: boolean;
  requireDigits: boolean;
  requireSymbols: boolean;
  disallowSequences: boolean;
  disallowRepeats: boolean;
  disallowCommonWords: boolean;
  minEntropyBits: number;
}
