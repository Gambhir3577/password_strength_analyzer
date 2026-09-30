# 🛡️ CipherGuard — Privacy-First Password Strength & Threat Analyzer

> **Zero telemetry. Zero server storage. 100% Client-Side Cryptographic Evaluation.**

CipherGuard is an enterprise-grade, client-side password strength analyzer, vulnerability scanner, compliance validator, and cryptographically secure password & passphrase generator built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 🔒 Security & Privacy Guarantees

1. **Zero Password Leakage by Design**:
   - Every character of entropy, pattern matching, and threat analysis runs exclusively within the local browser JavaScript runtime.
   - Input fields are hardened against browser autofill tools using `autocomplete="new-password"`, `spellcheck="false"`, and browser password manager opt-out attributes (`data-lpignore="true"`, `data-1p-ignore="true"`, `data-bitwarden-watching="false"`).
   - Secrets are never persisted in `localStorage`, `sessionStorage`, `IndexedDB`, or cookies.

2. **Strict Content Security Policy (CSP)**:
   - Outbound network requests are locked to `'self'` and explicitly restricted to `https://api.pwnedpasswords.com`.
   - `connect-src 'self' https://api.pwnedpasswords.com`
   - `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`.

3. **k-Anonymity Breach Verification (Opt-In Only)**:
   - When enabled, your password is converted to a SHA-1 hash locally using `crypto.subtle.digest('SHA-1', ...)`.
   - **Only the first 5 hexadecimal characters** (20 bits) of the hash are transmitted to Have I Been Pwned's range API.
   - The remaining 35 characters are compared locally against the returned candidate list in memory.
   - Network requests are aborted dynamically via `AbortController` whenever the input changes.

4. **Cryptographically Secure Generator**:
   - Generates random passwords and Diceware multi-word passphrases using standard `window.crypto.getRandomValues()`.
   - Uses bias-free rejection sampling to eliminate modulo arithmetic bias.
   - Clipboard auto-clearing timer (30 seconds) protects against clipboard snooping.

5. **Sanitized Security Audit Reports**:
   - Generates downloadable `.json` schemas and `.md` reports for DevSecOps/SIEM pipelines.
   - Reports are completely sanitized: **zero plaintext password or full hash is ever exported**.

---

## 🚀 Key Features

- **Dynamic 5-Level Strength Meter**:
  - Scores 0 (Very Weak), 1 (Weak), 2 (Fair), 3 (Strong), 4 (Very Strong).
  - Accessible dual color + text indicators with `aria-live="polite"` screen-reader announcements.

- **Enterprise Compliance Policy Engine**:
  - **NIST SP 800-63B** (Digital Identity Guidelines / Memorized Secrets AAL1-AAL3).
  - **PCI-DSS v4.0** (Requirement 8.3.6 Authentication Controls).
  - **CIS Enterprise Benchmarks** (Strict 14+ character standard).
  - **OWASP ASVS v4.0** (Application Security Verification Standard).
  - **Custom Configurable Organization Policy** (Interactive sliders and rule criteria).

- **Exportable Sanitized Audit Reports**:
  - Download structured JSON (`.json`) or formatted Markdown (`.md`) audit dossiers.
  - Native print stylesheet (`@media print`) for clean executive documentation.

- **Entropy & Search Space Capacity**:
  - Information-theoretic Shannon entropy calculation: $H = L \times \log_2(R)$.
  - Real-time character pool diversity metrics (Lowercase, Uppercase, Numbers, Special Symbols).

- **Multi-Pattern Vulnerability Detection**:
  - Common dictionary passwords (top 10k leaked dictionary words).
  - Keyboard spatial walks (QWERTY horizontal, vertical, and keypad paths).
  - Repeated sequences and arithmetic progressions (e.g. `abc`, `12345`, `876543`).
  - Date and year patterns (e.g. `1998`, `2024`, `04071995`).
  - Common l33tspeak substitutions (`@` $\rightarrow$ `a`, `0` $\rightarrow$ `o`, `3` $\rightarrow$ `e`, `$` $\rightarrow$ `s`, `1` $\rightarrow$ `i/l`, `!` $\rightarrow$ `i`).
  - Personalized token blacklist (checks user's name, email, or username).

- **4 Threat Scenario Crack Time Modeling**:
  - **Online Throttled** (100 guesses/hour): Login portals with rate limits and CAPTCHAs.
  - **Online Unthrottled** (10 guesses/sec): Misconfigured APIs or unprotected endpoints.
  - **Offline Slow Hash** (10,000 guesses/sec): Argon2id, bcrypt, PBKDF2, or scrypt.
  - **Offline GPU Cluster** (100,000,000,000 guesses/sec): Modern fast hash clusters (MD5, SHA-1, SHA-256, NTLM).

- **Instant Security Enhancers (Quick-Fix Toolbar)**:
  - 1-click actions: Add Symbol & Digit, Pad to 16+ Chars, Convert to Diceware Passphrase, Deduplicate Sequences.

- **Zero-Asset Web Audio Tactile Sound Effects**:
  - Synthesizer generated via browser `AudioContext` for score milestone changes and copy confirmation.
  - Muted by default with quick header toggle.

- **Keyboard Navigation & Cheat Sheet (`⌘K` / `Ctrl+K`)**:
  - Full keyboard accessibility across tabs, shortcuts modal, and generator actions.

- **Side-by-Side Compare Mode**:
  - Compare two passwords simultaneously to evaluate security trade-offs, entropy gains, and crack time enhancements.

- **Memorable Diceware Passphrase Generator**:
  - Generates 3 to 8 word passphrases with custom delimiters, capitalization modes, and optional numeric suffixes.
  - 1-click transfer to analyzer for immediate inspection.

- **Dark / Light / System Theme**:
  - Fully integrated system preference detection and accessible WCAG 2.1 AA color contrast compliance.

---

## 🛠️ Project Structure

```
password_strength_analyzer/
├── src/
│   ├── components/
│   │   ├── analyzer/         # PasswordInput, StrengthMeter, EntropyCard, CrackTimes, Breakdown, ComplianceChecklist, AuditReportModal, QuickFixToolbar
│   │   ├── compare/          # Side-by-side CompareView & verdict analysis
│   │   ├── generator/        # Random Character & Diceware Passphrase Generators
│   │   ├── privacy/          # Privacy Assurance Panel, k-Anonymity Explainer & HIBP Badge
│   │   ├── layout/           # Header, Footer, Navigation, ThemeToggle
│   │   └── common/           # Accessible Card, Button, Badge, ShortcutsModal primitives
│   ├── engine/
│   │   ├── compliance.ts     # NIST 800-63B, PCI-DSS v4.0, CIS, OWASP, Custom policy evaluators
│   │   ├── entropy.ts        # Shannon entropy calculation & pool sizing
│   │   ├── scoring.ts        # @zxcvbn-ts integration & score synthesis
│   │   ├── crackTimes.ts     # 4 threat scenario estimation
│   │   ├── feedback.ts       # Actionable, human-friendly suggestions
│   │   ├── generator.ts      # CSPRNG bias-free generator & Diceware
│   │   ├── wordlist.ts       # Curated EFF-style Diceware wordlist
│   │   └── patterns/         # Modular pattern matchers (dictionary, keyboard, leet, dates, etc.)
│   ├── hooks/                # usePasswordAnalyzer, useHibpBreachCheck, useClipboard, useTheme
│   ├── services/             # auditExportService, audioService, hibpService, clipboardService
│   ├── types/                # Strict TypeScript contracts (analyzer, compliance, hibp, generator, theme)
│   └── tests/
│       ├── unit/             # Vitest pure engine, compliance & pattern unit tests
│       ├── components/       # React Testing Library component tests
│       └── e2e/              # Playwright E2E, audit export, & privacy leak tests
├── playwright.config.ts      # Playwright browser testing configuration
├── vite.config.ts            # Vite 8 + Tailwind CSS configuration
└── tsconfig.json             # TypeScript strict configuration
```

---

## 🧪 Testing & Verification

### Running Unit & Component Tests (Vitest)
```bash
npm run test:run
```
- **45/45 Unit & Component Tests Passing** across 13 test suites covering:
  - Shannon entropy and pool variety math
  - Pattern detectors (keyboard walks, dictionary words, repetitions, sequences, dates, l33tspeak, personal blacklist)
  - NIST SP 800-63B, PCI-DSS v4.0, CIS Enterprise, and OWASP ASVS compliance rule engines
  - Sanitized JSON & Markdown audit export generator
  - Random generator uniform distribution & Diceware CSPRNG
  - React components (`PasswordInput`, `StrengthMeter`, `CompareView`, `GeneratorView`, `ComplianceChecklist`, `AuditReportModal`)

### Running End-to-End Tests (Playwright)
```bash
npm run test:e2e
```
- **10/10 E2E Test Suites Passing** covering:
  - Dynamic score evaluation for weak, medium, and strong passwords
  - Show/Hide visibility toggle and input clearing
  - Tab navigation across Analyzer, Compare, Generator, and Privacy panels
  - Export Audit Report modal navigation (Scorecard, Markdown, JSON Schema)
  - Interactive compliance standards switcher
  - Zero unapproved external network requests during typing
  - Strict 5-character prefix k-anonymity validation on HIBP opt-in
  - Passphrase generation & 1-click analyzer transfer
  - Random character mode with length adjustment
  - Responsive visual captures across Desktop, Tablet, and Mobile viewports

### Running Linting & Type Checking
```bash
npm run lint
npm run build
```
- **0 errors, 0 warnings** reported by Oxlint and TypeScript compiler.

---

## 📄 License
MIT License. Free to use, audit, and distribute.
