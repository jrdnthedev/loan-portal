/// <reference types="vitest" />

import type { AxeResults } from 'axe-core';

interface AxeMatchers {
  toHaveNoViolations(): void;
}

declare global {
  namespace Vi {
    interface Assertion extends AxeMatchers {}
    interface AsymmetricMatchersContaining extends AxeMatchers {}
  }
}

declare module '@vitest/expect' {
  interface Matchers<R = unknown> extends AxeMatchers {}
}

export {};
