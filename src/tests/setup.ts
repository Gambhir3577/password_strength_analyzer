import '@testing-library/jest-dom/vitest';
import * as nodeCrypto from 'crypto';

// Ensure Web Crypto API is present in jsdom environment
if (!globalThis.crypto) {
  globalThis.crypto = (nodeCrypto.webcrypto as unknown as Crypto) || (nodeCrypto as unknown as Crypto);
}
