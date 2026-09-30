import { test } from '@playwright/test';
import * as path from 'path';

const ARTIFACT_DIR = '/Users/gabru/.gemini/antigravity-ide/brain/729e7def-a8a8-43a3-b0b2-e504b2b3ed6f';

test.describe('Visual Screenshot Capture Suite', () => {
  test('captures screenshots of all major flows and viewports', async ({ page }) => {
    // 1. Initial Empty State
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_initial_empty_state.png'), fullPage: true });

    // 2. Weak Password Analysis with HIBP Breach
    const input = page.locator('#password-input');
    await input.fill('password123');
    const hibpToggle = page.locator('#hibp-toggle');
    await hibpToggle.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_weak_password_analysis.png'), fullPage: true });

    // 3. High Entropy Diceware Passphrase
    await input.fill('correct-horse-battery-staple');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_strong_diceware_passphrase.png'), fullPage: true });

    // 4. Compare Mode Side-by-Side
    await page.click('button#tab-compare');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_compare_mode.png'), fullPage: true });

    // 5. Generator Mode
    await page.click('button#tab-generator');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_passphrase_generator.png'), fullPage: true });

    // 6. Privacy & Threat Model Panel
    await page.click('button#tab-privacy');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_privacy_and_csp_panel.png'), fullPage: true });

    // 7. Light Theme Mode
    await page.locator('button[aria-label="Light theme"]:visible').click();
    await page.click('button#tab-analyzer');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_light_theme_analyzer.png'), fullPage: true });

    // 8. Mobile Viewport (375x812 iPhone X)
    await page.locator('button[aria-label="Dark theme"]:visible').click();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_mobile_responsive_view.png'), fullPage: true });
  });
});
