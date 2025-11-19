import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { TokenService } from './token.service';
import {
  User,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  AuthState,
} from '../interfaces/auth.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  // Signal-based state management
  private readonly _authState = signal<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  // Computed signals for reactive access
  readonly authState = this._authState.asReadonly();
  readonly user = computed(() => this._authState().user);
  readonly isAuthenticated = computed(() => this._authState().isAuthenticated);
  readonly isLoading = computed(() => this._authState().isLoading);

  // Legacy Observable support (if needed)
  private readonly _userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this._userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (this.tokenService.hasValidAccessToken()) {
      this.loadUserFromToken();
    }
  }

  private loadUserFromToken(): void {
    const token = this.tokenService.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user: User = {
          id: payload.sub,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: payload.role,
        };
        this.setAuthenticatedState(user);
      } catch (error) {
        console.error('Error parsing token:', error);
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoadingState(true);

    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        this.setAuthenticatedState(response.user);
      }),
      catchError((error) => {
        this.setLoadingState(false);
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.setUnauthenticatedState();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };

    return this.http.post<RefreshTokenResponse>(`${this.API_URL}/refresh`, request).pipe(
      tap((response: RefreshTokenResponse) => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      }),
    );
  }

  register(userData: any): Observable<LoginResponse> {
    this.setLoadingState(true);

    return this.http.post<LoginResponse>(`${this.API_URL}/register`, userData).pipe(
      tap((response: LoginResponse) => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        this.setAuthenticatedState(response.user);
      }),
      catchError((error) => {
        this.setLoadingState(false);
        return throwError(() => error);
      }),
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, { token, newPassword });
  }

  hasRole(role: string): boolean {
    const currentUser = this.user();
    return currentUser?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const currentUser = this.user();
    return currentUser ? roles.includes(currentUser.role) : false;
  }

  private setAuthenticatedState(user: User): void {
    this._authState.set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    this._userSubject.next(user);
  }

  private setUnauthenticatedState(): void {
    this._authState.set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    this._userSubject.next(null);
  }

  private setLoadingState(isLoading: boolean): void {
    this._authState.update((state: AuthState) => ({
      ...state,
      isLoading,
    }));
  }
}
