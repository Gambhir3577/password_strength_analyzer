import { test, expect } from '@playwright/test';

test.describe('Password & Passphrase Generator E2E Flow', () => {
  test('generates a passphrase and transfers it directly to analyzer', async ({ page }) => {
    await page.goto('/');

    // Navigate to generator tab
    await page.click('button#tab-generator');

    // Click "Analyze this Passphrase"
    const analyzeBtn = page.locator('button:has-text("Analyze this Passphrase")');
    await expect(analyzeBtn).toBeVisible();
    await analyzeBtn.click();

    // Verify transferred to analyzer tab and populated input
    const input = page.locator('#password-input');
    await expect(input).toBeVisible();
    await expect(input).not.toHaveValue('');

    const val = await input.inputValue();
    expect(val.length).toBeGreaterThan(0);
    await expect(page.getByText(/Strong|Very Strong/).first()).toBeVisible();
  });

  test('switches to random password mode and adjusts length', async ({ page }) => {
    await page.goto('/');

    await page.click('button#tab-generator');
    await page.click('button:has-text("Random Character Password")');

    await expect(page.getByText('Password Length')).toBeVisible();

    const analyzeBtn = page.locator('button:has-text("Analyze this Password")');
    await expect(analyzeBtn).toBeVisible();
    await analyzeBtn.click();

    // Verify transferred to analyzer tab and populated input
    const input = page.locator('#password-input');
    await expect(input).toBeVisible();
    await expect(input).not.toHaveValue('');

    const val = await input.inputValue();
    expect(val.length).toBeGreaterThan(0);
  });
});

