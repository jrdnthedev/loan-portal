import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AuthInterceptor } from './interceptors/auth.interceptor';

/**
 * Provides authentication-related services and interceptors
 */
export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // HTTP Client with interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // Auth Interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ]);
}
