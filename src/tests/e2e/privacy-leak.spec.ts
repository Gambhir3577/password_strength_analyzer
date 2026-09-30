import { test, expect } from '@playwright/test';

test.describe('Privacy, Zero-Leakage & K-Anonymity Verification', () => {
  test('strictly ensures zero network traffic while typing without opt-in', async ({ page }) => {
    const networkRequests: string[] = [];

    page.on('request', (req) => {
      const url = req.url();
      // Ignore static bundle / dev server assets on localhost & 127.0.0.1 and fonts
      if (
        !url.includes('localhost') &&
        !url.includes('127.0.0.1') &&
        !url.includes('fonts.gstatic.com') &&
        !url.includes('fonts.googleapis.com')
      ) {
        networkRequests.push(url);
      }
    });

    await page.goto('/');

    const passwordInput = page.locator('#password-input');
    const secret = 'MySuperConfidentialSecretPassword2026!@#';
    
    // Type password character by character
    await passwordInput.pressSequentially(secret, { delay: 30 });

    // Wait a brief moment for any hypothetical debounce
    await page.waitForTimeout(600);

    // Verify 0 external network requests were made
    expect(networkRequests.length).toBe(0);

    // Verify localStorage & sessionStorage do not contain the secret
    const localStorageData = await page.evaluate(() => JSON.stringify(window.localStorage));
    const sessionStorageData = await page.evaluate(() => JSON.stringify(window.sessionStorage));

    expect(localStorageData).not.toContain(secret);
    expect(sessionStorageData).not.toContain(secret);
  });

  test('sends ONLY 5-character prefix when HIBP breach check is enabled', async ({ page }) => {
    const externalRequests: string[] = [];
    const secret = 'password123'; // SHA-1 is CBFDAC6008F9CAB4083784CBD1874F76618D2A97 -> Prefix: CBFDA

    page.on('request', (req) => {
      if (req.url().includes('api.pwnedpasswords.com')) {
        externalRequests.push(req.url());
      }
    });

    await page.goto('/');

    // Enable HIBP toggle
    const toggle = page.locator('#hibp-toggle');
    await toggle.click();

    const passwordInput = page.locator('#password-input');
    await passwordInput.fill(secret);

    // Wait for debounce and response
    await page.waitForTimeout(600);

    // Check captured outbound request
    expect(externalRequests.length).toBeGreaterThanOrEqual(1);
    const lastRequest = externalRequests[externalRequests.length - 1];

    // Must match https://api.pwnedpasswords.com/range/CBFDA exactly
    expect(lastRequest).toBe('https://api.pwnedpasswords.com/range/CBFDA');
    expect(lastRequest).not.toContain('password123');
    expect(lastRequest.endsWith('/CBFDA')).toBe(true);
  });
});
