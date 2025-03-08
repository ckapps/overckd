// ========================================================
// Jest extensions
// ========================================================
import 'jest-extended/all';

// ========================================================
// Polyfills
// ========================================================
// node-specific polyfills
import { URL } from 'node:url';
import { TextDecoder, TextEncoder } from 'node:util';

function polyfillEncoderDecoder() {
  if (typeof globalThis.TextEncoder === 'undefined') {
    Object.assign(globalThis, { TextDecoder, TextEncoder });
  }
}

function polyfillURL() {
  if (typeof globalThis.URL === 'undefined') {
    Object.assign(globalThis, { URL });
  }
  // Some environments might not provide all the URL features
  if (typeof globalThis.URL.canParse === 'undefined') {
    Object.assign(globalThis.URL, { ...URL, ...globalThis.URL });
  }
}

polyfillEncoderDecoder();
polyfillURL();
