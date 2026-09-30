import { describe, it, expect, vi } from 'vitest';
import { hashPasswordSha1, checkPasswordBreach } from '../../services/hibpService';

describe('HIBP Service & Web Crypto SHA-1', () => {
  it('correctly hashes passwords with SHA-1 to uppercase hex', async () => {
    // Known SHA-1 for "password": 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8
    const hash = await hashPasswordSha1('password');
    expect(hash).toBe('5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8');
  });

  it('queries HIBP using only 5-character prefix and matches suffix', async () => {
    const testPassword = 'mySecretSuperKey123';
    const fullHash = await hashPasswordSha1(testPassword);
    const expectedPrefix = fullHash.slice(0, 5);
    const expectedSuffix = fullHash.slice(5);

    const mockResponseText = `0018A45C4D1DEF81644B54AB7F969B88D65:4
${expectedSuffix}:42
00D4F6E8FF4E0AD026755F97A20496DC471:1`;

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      text: async () => mockResponseText,
    } as Response);

    const result = await checkPasswordBreach(testPassword);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    
    // Verify only the 5-char prefix is sent in URL
    const requestedUrl = fetchSpy.mock.calls[0][0] as string;
    expect(requestedUrl).toBe(`https://api.pwnedpasswords.com/range/${expectedPrefix}`);
    expect(requestedUrl).not.toContain(testPassword);
    expect(requestedUrl).not.toContain(expectedSuffix);

    expect(result.status).toBe('breached');
    expect(result.breachCount).toBe(42);

    fetchSpy.mockRestore();
  });

  it('identifies breached passwords when suffix is found in HIBP database', async () => {
    const mockResponseText = `0018A45C4D1DEF81644B54AB7F969B88D65:4
1E4C9B93F3F0682250B6CF8331B7EE68FD8:3861493
00D4F6E8FF4E0AD026755F97A20496DC471:1`;

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      text: async () => mockResponseText,
    } as Response);

    const result = await checkPasswordBreach('password');
    expect(result.status).toBe('breached');
    expect(result.breachCount).toBe(3861493);
    expect(result.prefix).toBe('5BAA6');

    fetchSpy.mockRestore();
  });

  it('identifies safe (unbreached) passwords when suffix is not present in range', async () => {
    const mockResponseText = `0018A45C4D1DEF81644B54AB7F969B88D65:4
00D4F6E8FF4E0AD026755F97A20496DC471:1`;

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      text: async () => mockResponseText,
    } as Response);

    const result = await checkPasswordBreach('UncommonSuperSecretPassword_2026!#$');
    expect(result.status).toBe('safe');
    expect(result.breachCount).toBe(0);

    fetchSpy.mockRestore();
  });
});
