import { test, expect } from '@playwright/test';

test.describe('Password Strength Analyzer E2E Flow', () => {
  test('evaluates weak, medium, and strong passwords dynamically', async ({ page }) => {
    await page.goto('/');

    // Verify initial header and elements
    await expect(page.locator('span:has-text("CipherGuard")').first()).toBeVisible();

    const passwordInput = page.locator('#password-input');
    await expect(passwordInput).toBeVisible();

    // 1. Weak password test
    await passwordInput.fill('password123');
    await expect(page.getByText('Very Weak').first()).toBeVisible();
    await expect(page.getByText('Common dictionary word').first()).toBeVisible();

    // 2. High entropy Diceware passphrase test
    await passwordInput.fill('correct-horse-battery-staple');
    await expect(page.getByText(/Strong|Very Strong/).first()).toBeVisible();
    await expect(page.getByText('Clean Pattern Profile')).toBeVisible();

    // 3. Complex character password test
    await passwordInput.fill('vX8#mK9!qL2$zP1~');
    await expect(page.getByText(/Strong|Very Strong/).first()).toBeVisible();
  });

  test('allows toggling password visibility and clearing input', async ({ page }) => {
    await page.goto('/');

    const passwordInput = page.locator('#password-input');
    await passwordInput.fill('SuperSecretKey!99');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click Show password
    const showBtn = page.locator('button[title="Show password"]');
    await showBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click Hide password
    const hideBtn = page.locator('button[title="Hide password"]');
    await hideBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Clear password
    const clearBtn = page.locator('button[title="Clear password"]');
    await clearBtn.click();
    await expect(passwordInput).toHaveValue('');
    await expect(page.getByText('Awaiting Input')).toBeVisible();
  });

  test('switches tabs between Analyzer, Compare, Generator, and Privacy', async ({ page }) => {
    await page.goto('/');

    // Compare tab
    await page.click('button#tab-compare');
    await expect(page.getByText('Compare Password Strength')).toBeVisible();

    // Generator tab
    await page.click('button#tab-generator');
    await expect(page.getByText('Secure Password & Passphrase Generator')).toBeVisible();

    // Privacy tab
    await page.click('button#tab-privacy');
    await expect(page.getByText('Client-Side Security Guarantee')).toBeVisible();
    await expect(page.getByText('Active Content Security Policy')).toBeVisible();
  });

  test('opens Export Audit Report modal and navigates tabs', async ({ page }) => {
    await page.goto('/');

    const passwordInput = page.locator('#password-input');
    await passwordInput.fill('Tr0ub4dor&3!');

    // Click Export Audit Report
    const exportBtn = page.getByRole('button', { name: /Export Audit Report/i });
    await exportBtn.click();

    await expect(page.getByText('Cryptographic Security & Compliance Audit')).toBeVisible();
    await expect(page.getByText('Executive Overview')).toBeVisible();

    // Switch to Markdown Report tab
    await page.getByRole('button', { name: /Markdown Report/i }).click();
    await expect(page.locator('pre:has-text("CipherGuard Security Audit Report")')).toBeVisible();

    // Switch to JSON Schema tab
    await page.getByRole('button', { name: /JSON Schema/i }).click();
    await expect(page.locator('pre:has-text("CPG-")')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: /Close modal/i }).click();
    await expect(page.getByText('Cryptographic Security & Compliance Audit')).not.toBeVisible();
  });

  test('evaluates compliance standards dynamically', async ({ page }) => {
    await page.goto('/');

    const passwordInput = page.locator('#password-input');
    await passwordInput.fill('CorrectHorseBatteryStaple2026!');

    await expect(page.getByText('Compliance & Security Policy Engine')).toBeVisible();

    // Switch to PCI-DSS
    await page.getByRole('button', { name: /PCI-DSS v4.0/i }).click();
    await expect(page.getByText('Payment Card Industry Data Security Standard')).toBeVisible();

    // Switch to CIS Enterprise
    await page.getByRole('button', { name: /CIS Enterprise/i }).click();
    await expect(page.getByText('CIS Enterprise Benchmark & Strict Password Policy Standard')).toBeVisible();
  });
});
