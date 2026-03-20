/// <reference types="vitest/globals" />

import type { AxeResults } from 'axe-core';

declare module 'vitest' {
  export interface Assertion {
    /**
     * Asserts that the given axe-core results object has no violations
     */
    toHaveNoViolations(): void;
  }

  export interface AsymmetricMatchersContaining {
    /**
     * Asserts that the given axe-core results object has no violations
     */
    toHaveNoViolations(): void;
  }
}
