import type { PasswordAnalysisResult } from '../types/analyzer';
import type {
  ComplianceStandardId,
  ComplianceStandardResult,
  ComplianceRuleResult,
  CustomPolicyConfig,
} from '../types/compliance';

export const DEFAULT_CUSTOM_POLICY: CustomPolicyConfig = {
  minLength: 14,
  requireLowercase: true,
  requireUppercase: true,
  requireDigits: true,
  requireSymbols: true,
  disallowSequences: true,
  disallowRepeats: true,
  disallowCommonWords: true,
  minEntropyBits: 60,
};

/**
 * Evaluates a password against NIST SP 800-63B (Digital Identity Guidelines).
 * Guidelines prioritize length, reject compromised/dictionary tokens,
 * and discourage arbitrary composition rules.
 */
export function evaluateNist80063B(analysis: PasswordAnalysisResult): ComplianceStandardResult {
  const { passwordLength, variety, patterns } = analysis;
  const rules: ComplianceRuleResult[] = [];

  // Rule 1: Minimum length >= 8 characters
  const lengthPass = passwordLength >= 8;
  rules.push({
    id: 'nist-min-length',
    name: 'Minimum 8 Characters',
    description: 'NIST Section 5.1.1.2 requires memorized secrets to be at least 8 characters in length.',
    rationale: 'Adequate minimum search space is fundamental to resisting brute-force attacks.',
    status: lengthPass ? 'pass' : 'fail',
    details: lengthPass
      ? `Length is ${passwordLength} characters (>= 8).`
      : `Current length is ${passwordLength} characters. Need at least 8.`,
    remediation: 'Increase password length to at least 8 characters (15+ recommended).',
  });

  // Rule 2: High Length Recommendation (>= 15 for elevated assurance)
  const highLengthPass = passwordLength >= 15;
  rules.push({
    id: 'nist-high-length',
    name: 'Recommended 15+ Characters (AAL2+)',
    description: 'NIST recommends 15+ characters or multi-word passphrases for elevated risk systems.',
    rationale: 'Passphrases significantly increase search space without creating memorability friction.',
    status: highLengthPass ? 'pass' : passwordLength >= 12 ? 'warning' : 'fail',
    details: highLengthPass
      ? `Length is ${passwordLength} characters, satisfying elevated security requirements.`
      : `Length is ${passwordLength} characters. 15+ is ideal for high-assurance passphrases.`,
    remediation: 'Use a 4+ word passphrase or lengthen password to 15+ characters.',
  });

  // Rule 3: No Known Breached / Common Dictionary Matches
  const hasDictionary = patterns.some((p) => p.type === 'dictionary');
  rules.push({
    id: 'nist-no-compromised',
    name: 'No Common Dictionary / Leaked Words',
    description: 'NIST mandates rejecting passwords found in lists of compromised or commonly chosen values.',
    rationale: 'Attackers utilize targeted wordlists from historical breaches before attempting brute force.',
    status: hasDictionary ? 'fail' : 'pass',
    details: hasDictionary
      ? `Contains dictionary match: "${patterns.find((p) => p.type === 'dictionary')?.token}".`
      : 'No common leaked dictionary words detected.',
    remediation: 'Replace dictionary words with random words or uncommon combinations.',
  });

  // Rule 4: No Keyboard Walks or Trivial Sequences
  const hasSequences = patterns.some(
    (p) => p.type === 'keyboard_walk' || p.type === 'sequence' || p.type === 'repetition'
  );
  rules.push({
    id: 'nist-no-sequences',
    name: 'No Predictable Sequential Patterns',
    description: 'NIST requires disallowing repetitive characters, keyboard patterns, and sequences.',
    rationale: 'Predictable spatial runs (e.g. qwerty, 12345) reduce effective entropy dramatically.',
    status: hasSequences ? 'fail' : 'pass',
    details: hasSequences
      ? `Detected ${patterns.filter((p) => p.type === 'keyboard_walk' || p.type === 'sequence' || p.type === 'repetition').length} sequential/spatial pattern(s).`
      : 'No spatial walks or arithmetic sequences detected.',
    remediation: 'Eliminate runs like "12345" or "qwerty" and repeated adjacent characters.',
  });

  // Rule 5: Support Full Character Space (ASCII + Unicode)
  const supportsVariety = variety.spaceCount > 0 || variety.hasSymbols || variety.hasDigits || variety.hasUppercase;
  rules.push({
    id: 'nist-character-space',
    name: 'Broad Character Set Support',
    description: 'NIST advises systems to permit all ASCII characters and spaces without forcing arbitrary complexity.',
    rationale: 'Allowing spaces and diverse punctuation empowers users to form long, memorable passphrases.',
    status: supportsVariety ? 'pass' : 'warning',
    details: variety.spaceCount > 0
      ? 'Password utilizes natural spacing (excellent for passphrases).'
      : 'Password is accepted under modern character set standards.',
    remediation: 'Consider using spaces or natural punctuation between passphrase words.',
  });

  // Rule 6: Context Blacklist (Personal Information)
  const hasPersonal = patterns.some((p) => p.type === 'user_input');
  rules.push({
    id: 'nist-no-personal',
    name: 'No Context-Specific Personal Info',
    description: 'NIST prohibits memorized secrets that contain user names, emails, or service names.',
    rationale: 'Targeted spear-phishing and social engineering easily guesses personal identity tokens.',
    status: hasPersonal ? 'fail' : 'pass',
    details: hasPersonal
      ? 'Password contains personalized user details or account identifiers.'
      : 'Zero personal identifier collisions found.',
    remediation: 'Remove any names, usernames, or organizational acronyms.',
  });

  const passedCount = rules.filter((r) => r.status === 'pass').length;
  const isCompliant = rules.every((r) => r.status !== 'fail');
  const scorePercentage = Math.round((passedCount / rules.length) * 100);

  return {
    id: 'nist_800_63b',
    name: 'NIST SP 800-63B',
    organization: 'National Institute of Standards and Technology',
    summary: 'Digital Identity Guidelines: Memorized Secrets (AAL1-AAL3)',
    version: 'Revision 3/4 Draft',
    isCompliant,
    scorePercentage,
    passedCount,
    totalCount: rules.length,
    rules,
  };
}

/**
 * Evaluates a password against PCI-DSS v4.0 (Requirement 8.3.6).
 * Mandates 12+ characters, numeric & alphabetic characters, and no repeats.
 */
export function evaluatePciDssV4(analysis: PasswordAnalysisResult): ComplianceStandardResult {
  const { passwordLength, variety, patterns } = analysis;
  const rules: ComplianceRuleResult[] = [];

  // Rule 1: Minimum 12 characters
  const lenPass = passwordLength >= 12;
  rules.push({
    id: 'pci-min-length',
    name: 'Minimum 12 Characters (Req 8.3.6)',
    description: 'PCI-DSS v4.0 mandates passwords must be at least 12 characters in length (or 15+ for admins).',
    rationale: 'Protects cardholder data environments against rapid offline hash cracking.',
    status: lenPass ? 'pass' : 'fail',
    details: lenPass
      ? `Length is ${passwordLength} characters (>= 12).`
      : `Current length is ${passwordLength} characters. PCI-DSS v4 requires >= 12.`,
    remediation: 'Increase password length to at least 12 characters.',
  });

  // Rule 2: Both Alphabetic and Numeric characters
  const hasAlpha = variety.hasLowercase || variety.hasUppercase;
  const hasNum = variety.hasDigits;
  const alphaNumPass = hasAlpha && hasNum;
  rules.push({
    id: 'pci-alphanumeric',
    name: 'Contains Both Alphabetic & Numeric Characters',
    description: 'PCI-DSS v4.0 Requirement 8.3.6 requires both letters and numbers.',
    rationale: 'Ensures the character pool exceeds simple numeric pins or single-case strings.',
    status: alphaNumPass ? 'pass' : 'fail',
    details: alphaNumPass
      ? 'Contains both alphabetic characters and digits.'
      : !hasAlpha
      ? 'Missing alphabetic letters (A-Z / a-z).'
      : 'Missing numeric digits (0-9).',
    remediation: 'Add both letters and numeric digits to the password.',
  });

  // Rule 3: No Common / Leaked Passwords
  const hasDict = patterns.some((p) => p.type === 'dictionary');
  rules.push({
    id: 'pci-no-common',
    name: 'No Common or Default Credentials',
    description: 'PCI-DSS prohibits default vendor passwords and common breach lists.',
    rationale: 'Default and leaked credentials are prime targets for automated credential stuffing.',
    status: hasDict ? 'fail' : 'pass',
    details: hasDict ? 'Contains matches against common leaked credential dictionaries.' : 'Passed common wordlist checks.',
    remediation: 'Avoid standard dictionary words or predictable phrase structures.',
  });

  // Rule 4: No Trivial Sequential Runs
  const hasSequences = patterns.some((p) => p.type === 'sequence' || p.type === 'keyboard_walk');
  rules.push({
    id: 'pci-no-sequences',
    name: 'No Sequential Patterns',
    description: 'Prevents predictable sequences that compromise the effective complexity.',
    rationale: 'Sequential numbers (e.g. 1234) reduce effective keyspace to near zero.',
    status: hasSequences ? 'fail' : 'pass',
    details: hasSequences ? 'Contains sequential or keyboard run patterns.' : 'No sequential patterns detected.',
    remediation: 'Replace sequential patterns with non-contiguous random characters.',
  });

  const passedCount = rules.filter((r) => r.status === 'pass').length;
  const isCompliant = rules.every((r) => r.status !== 'fail');
  const scorePercentage = Math.round((passedCount / rules.length) * 100);

  return {
    id: 'pci_dss_v4',
    name: 'PCI-DSS v4.0',
    organization: 'Payment Card Industry Security Standards Council',
    summary: 'Payment Card Industry Data Security Standard (Requirement 8.3.6)',
    version: '4.0',
    isCompliant,
    scorePercentage,
    passedCount,
    totalCount: rules.length,
    rules,
  };
}

/**
 * Evaluates against CIS Enterprise Benchmark & Strict Corporate Standards.
 */
export function evaluateCisEnterprise(analysis: PasswordAnalysisResult): ComplianceStandardResult {
  const { passwordLength, variety, patterns, score, entropyBits } = analysis;
  const rules: ComplianceRuleResult[] = [];

  // Rule 1: Minimum 14 characters
  const lenPass = passwordLength >= 14;
  rules.push({
    id: 'cis-min-length',
    name: 'Minimum 14 Characters',
    description: 'CIS Enterprise Benchmarks mandate >= 14 characters for domain and enterprise accounts.',
    rationale: 'High length provides resistance against NTLM/Kerberoasting and GPU cracking rigs.',
    status: lenPass ? 'pass' : 'fail',
    details: lenPass ? `Length is ${passwordLength} (>= 14).` : `Length is ${passwordLength} (need 14+).`,
    remediation: 'Extend password length to 14 or more characters.',
  });

  // Rule 2: 4-Class Character Complexity
  const complexityCount = [
    variety.hasLowercase,
    variety.hasUppercase,
    variety.hasDigits,
    variety.hasSymbols,
  ].filter(Boolean).length;
  const compPass = complexityCount >= 3;
  const compFull = complexityCount === 4;
  rules.push({
    id: 'cis-complexity',
    name: 'Character Class Diversity (3 of 4 or 4 of 4)',
    description: 'Requires lowercase, uppercase, numeric, and symbol characters.',
    rationale: 'Expands the search space pool size (R >= 94) to defeat mask attacks.',
    status: compFull ? 'pass' : compPass ? 'warning' : 'fail',
    details: `Utilizes ${complexityCount} of 4 character classes (Lower, Upper, Digits, Symbols).`,
    remediation: 'Include at least one uppercase letter, lowercase letter, number, and special symbol.',
  });

  // Rule 3: Zero Structural Pattern Vulnerabilities
  const hasStructuralPatterns = patterns.some(
    (p) => p.type === 'dictionary' || p.type === 'sequence' || p.type === 'repetition' || p.type === 'user_input'
  );
  rules.push({
    id: 'cis-no-patterns',
    name: 'No Structural Patterns or Repetitions',
    description: 'Disallows dictionary words, leetspeak roots, repetitions, and predictable sequences.',
    rationale: 'Heuristic cracking engines exploit structural patterns with rules engines like Hashcat.',
    status: hasStructuralPatterns ? 'fail' : 'pass',
    details: hasStructuralPatterns
      ? `Found ${patterns.length} structural pattern match(es).`
      : 'No structural patterns found.',
    remediation: 'Eliminate dictionary roots, leet substitutions, and repetitive sequences.',
  });

  // Rule 4: Entropy & zxcvbn Strength Score >= 3 (Strong)
  const scorePass = score >= 3 || entropyBits >= 55;
  rules.push({
    id: 'cis-entropy',
    name: 'Information Entropy & Strength Rating',
    description: 'Mathematical entropy and zxcvbn score must reach enterprise grade "Strong" (Score >= 3).',
    rationale: 'Ensures brute-force resistance exceeds standard automated password spraying thresholds.',
    status: scorePass ? 'pass' : 'fail',
    details: `Entropy is ${entropyBits} bits (Score: ${score}/4).`,
    remediation: 'Increase length and randomness to reach at least "Strong" rating.',
  });

  const passedCount = rules.filter((r) => r.status === 'pass').length;
  const isCompliant = rules.every((r) => r.status !== 'fail');
  const scorePercentage = Math.round((passedCount / rules.length) * 100);

  return {
    id: 'cis_enterprise',
    name: 'CIS Enterprise Benchmark',
    organization: 'Center for Internet Security',
    summary: 'CIS Enterprise Benchmark & Strict Password Policy Standard',
    version: 'v8.0',
    isCompliant,
    scorePercentage,
    passedCount,
    totalCount: rules.length,
    rules,
  };
}

/**
 * Evaluates against OWASP ASVS v4.0 Authentication Guidelines.
 */
export function evaluateOwaspAsvs(analysis: PasswordAnalysisResult): ComplianceStandardResult {
  const { passwordLength, patterns, score } = analysis;
  const rules: ComplianceRuleResult[] = [];

  // Rule 1: Length >= 12
  const lenPass = passwordLength >= 12;
  rules.push({
    id: 'owasp-length',
    name: 'Minimum 12 Characters (ASVS V2.1.1)',
    description: 'Verify passwords are at least 12 characters in length if chosen by a user.',
    rationale: 'Provides sufficient entropy to resist credential stuffing and brute-forcing.',
    status: lenPass ? 'pass' : 'fail',
    details: `Length is ${passwordLength} characters.`,
    remediation: 'Ensure the password is at least 12 characters.',
  });

  // Rule 2: Breached Password Check (ASVS V2.1.7)
  const hasDict = patterns.some((p) => p.type === 'dictionary');
  rules.push({
    id: 'owasp-breach',
    name: 'Breach / Common Password Check (ASVS V2.1.7)',
    description: 'Verify passwords are submitted against a list of compromised passwords and common wordlists.',
    rationale: 'Preempts credential stuffing attacks based on historical breach datasets.',
    status: hasDict ? 'fail' : 'pass',
    details: hasDict ? 'Matches common breach/dictionary entries.' : 'Zero common list matches found.',
    remediation: 'Select a unique password or Diceware passphrase.',
  });

  // Rule 3: Context-Specific Words Check (ASVS V2.1.9)
  const hasUserContext = patterns.some((p) => p.type === 'user_input');
  rules.push({
    id: 'owasp-context',
    name: 'No User-Specific Tokens (ASVS V2.1.9)',
    description: 'Verify password does not contain user name, email, account name, or service name.',
    rationale: 'Defeats targeted password guessing based on OSINT and public profile attributes.',
    status: hasUserContext ? 'fail' : 'pass',
    details: hasUserContext ? 'Contains user-specific profile tokens.' : 'No profile tokens found.',
    remediation: 'Remove username, email, or company name fragments.',
  });

  // Rule 4: Strength Rating (Score >= 2)
  const scorePass = score >= 2;
  rules.push({
    id: 'owasp-strength',
    name: 'Resilient Strength Rating (Score >= Fair/Strong)',
    description: 'Verify password is evaluated by an entropy and pattern analysis engine.',
    rationale: 'Enforces algorithmic validation over simple cosmetic regex rules.',
    status: scorePass ? 'pass' : 'fail',
    details: `Score is ${score}/4.`,
    remediation: 'Improve diversity and length to reach at least Fair/Strong rating.',
  });

  const passedCount = rules.filter((r) => r.status === 'pass').length;
  const isCompliant = rules.every((r) => r.status !== 'fail');
  const scorePercentage = Math.round((passedCount / rules.length) * 100);

  return {
    id: 'owasp_asvs',
    name: 'OWASP ASVS 4.0',
    organization: 'Open Web Application Security Project',
    summary: 'Application Security Verification Standard (Chapter 2: Authentication)',
    version: 'v4.0.3 Level 2',
    isCompliant,
    scorePercentage,
    passedCount,
    totalCount: rules.length,
    rules,
  };
}

/**
 * Evaluates against a custom configurable policy.
 */
export function evaluateCustomPolicy(
  analysis: PasswordAnalysisResult,
  config: CustomPolicyConfig = DEFAULT_CUSTOM_POLICY
): ComplianceStandardResult {
  const { passwordLength, variety, patterns, entropyBits } = analysis;
  const rules: ComplianceRuleResult[] = [];

  // Minimum Length
  const lenPass = passwordLength >= config.minLength;
  rules.push({
    id: 'custom-length',
    name: `Minimum Length (${config.minLength} chars)`,
    description: `Requires at least ${config.minLength} characters.`,
    rationale: 'Configured minimum length policy.',
    status: lenPass ? 'pass' : 'fail',
    details: `Current length: ${passwordLength}/${config.minLength}.`,
    remediation: `Add ${Math.max(0, config.minLength - passwordLength)} more character(s).`,
  });

  if (config.requireLowercase) {
    rules.push({
      id: 'custom-lower',
      name: 'Require Lowercase Letter (a-z)',
      description: 'At least one lowercase character.',
      rationale: 'Character variety standard.',
      status: variety.hasLowercase ? 'pass' : 'fail',
      details: variety.hasLowercase ? 'Contains lowercase.' : 'Missing lowercase letters.',
      remediation: 'Include lowercase characters (a-z).',
    });
  }

  if (config.requireUppercase) {
    rules.push({
      id: 'custom-upper',
      name: 'Require Uppercase Letter (A-Z)',
      description: 'At least one uppercase character.',
      rationale: 'Character variety standard.',
      status: variety.hasUppercase ? 'pass' : 'fail',
      details: variety.hasUppercase ? 'Contains uppercase.' : 'Missing uppercase letters.',
      remediation: 'Include uppercase characters (A-Z).',
    });
  }

  if (config.requireDigits) {
    rules.push({
      id: 'custom-digits',
      name: 'Require Numeric Digit (0-9)',
      description: 'At least one numeric character.',
      rationale: 'Character variety standard.',
      status: variety.hasDigits ? 'pass' : 'fail',
      details: variety.hasDigits ? 'Contains digits.' : 'Missing numeric digits.',
      remediation: 'Include numeric digits (0-9).',
    });
  }

  if (config.requireSymbols) {
    rules.push({
      id: 'custom-symbols',
      name: 'Require Special Symbol (!@#$%...)',
      description: 'At least one special punctuation symbol.',
      rationale: 'Character variety standard.',
      status: variety.hasSymbols ? 'pass' : 'fail',
      details: variety.hasSymbols ? 'Contains symbols.' : 'Missing special symbols.',
      remediation: 'Include special symbols (!, @, #, $, %, etc.).',
    });
  }

  if (config.disallowSequences) {
    const hasSeq = patterns.some((p) => p.type === 'sequence' || p.type === 'keyboard_walk');
    rules.push({
      id: 'custom-sequences',
      name: 'Disallow Keyboard Walks & Sequences',
      description: 'Disallow runs like "12345" or "qwerty".',
      rationale: 'Avoid predictable layout patterns.',
      status: hasSeq ? 'fail' : 'pass',
      details: hasSeq ? 'Sequential run detected.' : 'No sequential patterns found.',
      remediation: 'Remove sequential characters.',
    });
  }

  if (config.disallowRepeats) {
    const hasRep = patterns.some((p) => p.type === 'repetition');
    rules.push({
      id: 'custom-repeats',
      name: 'Disallow Repeated Characters (e.g. "aaa")',
      description: 'Disallow repeated characters or duplicated blocks.',
      rationale: 'Eliminate repetitive redundancy.',
      status: hasRep ? 'fail' : 'pass',
      details: hasRep ? 'Repetitive sequences detected.' : 'No repetitions found.',
      remediation: 'Replace repeating characters.',
    });
  }

  if (config.disallowCommonWords) {
    const hasDict = patterns.some((p) => p.type === 'dictionary');
    rules.push({
      id: 'custom-dictionary',
      name: 'Disallow Common Dictionary Words',
      description: 'Disallow top leaked passwords.',
      rationale: 'Resist dictionary attacks.',
      status: hasDict ? 'fail' : 'pass',
      details: hasDict ? 'Contains dictionary word.' : 'No dictionary words detected.',
      remediation: 'Select random or unlinked words.',
    });
  }

  if (config.minEntropyBits > 0) {
    const entPass = entropyBits >= config.minEntropyBits;
    rules.push({
      id: 'custom-entropy',
      name: `Minimum Entropy (${config.minEntropyBits} bits)`,
      description: `Requires at least ${config.minEntropyBits} bits of Shannon entropy.`,
      rationale: 'Mathematical keyspace assurance.',
      status: entPass ? 'pass' : 'fail',
      details: `Entropy is ${entropyBits} bits (target: >= ${config.minEntropyBits}).`,
      remediation: `Increase randomness to reach >= ${config.minEntropyBits} bits.`,
    });
  }

  const passedCount = rules.filter((r) => r.status === 'pass').length;
  const isCompliant = rules.every((r) => r.status !== 'fail');
  const scorePercentage = Math.round((passedCount / rules.length) * 100);

  return {
    id: 'custom',
    name: 'Custom Enterprise Policy',
    organization: 'Internal Security Policy',
    summary: 'Tailored organization-specific password standard',
    version: 'Custom v1.0',
    isCompliant,
    scorePercentage,
    passedCount,
    totalCount: rules.length,
    rules,
  };
}

/**
 * Runs all compliance evaluations on a password analysis result.
 */
export function evaluateAllCompliance(
  analysis: PasswordAnalysisResult,
  customConfig: CustomPolicyConfig = DEFAULT_CUSTOM_POLICY
): Record<ComplianceStandardId, ComplianceStandardResult> {
  return {
    nist_800_63b: evaluateNist80063B(analysis),
    pci_dss_v4: evaluatePciDssV4(analysis),
    cis_enterprise: evaluateCisEnterprise(analysis),
    owasp_asvs: evaluateOwaspAsvs(analysis),
    custom: evaluateCustomPolicy(analysis, customConfig),
  };
}
