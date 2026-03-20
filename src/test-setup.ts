import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

// Extend Vitest with axe matchers
expect.extend(matchers);

// Initialize the Angular testing environment for zoneless mode
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: true },
});
