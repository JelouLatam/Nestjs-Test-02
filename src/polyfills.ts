// Polyfills that must run before other imports which may use globalThis.crypto
/* eslint-disable @typescript-eslint/no-var-requires */
const nodeCrypto = require('crypto');

// If globalThis.crypto exists but lacks randomUUID, add it.
try {
    if (typeof (globalThis as any).crypto === 'undefined') {
        // Define a non-enumerable property only when missing
        Object.defineProperty(globalThis, 'crypto', {
            value: nodeCrypto,
            configurable: true,
            enumerable: false,
            writable: false,
        });
    } else if (typeof (globalThis as any).crypto.randomUUID !== 'function') {
        // Attach randomUUID helper if missing
        try {
            Object.defineProperty((globalThis as any).crypto, 'randomUUID', {
                value: nodeCrypto.randomUUID?.bind(nodeCrypto) ?? (() => {
                    // fallback: simple UUID v4 generator
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                        const r = (Math.random() * 16) | 0;
                        const v = c === 'x' ? r : (r & 0x3) | 0x8;
                        return v.toString(16);
                    });
                }),
                configurable: true,
                enumerable: false,
                writable: false,
            });
        } catch (e) {
            // If the crypto object is sealed/read-only, skip gracefully
        }
    }
} catch (e) {
    // Best-effort polyfill; if we can't define properties, continue.
}

// Export nothing; the module is imported for its side-effects.
export { };
