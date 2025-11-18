import { computed, inject, Injectable, signal } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private loginUrl = inject(APP_SETTINGS).baseUrl + '/login';

  accessToken = signal(this.getValidStoredToken());
  adminLoggedIn = computed(() => this.accessToken() !== '');

  // Method to get and validate stored token
  private getValidStoredToken(): string {
    const storedToken = localStorage.getItem('authToken');
    const storedTokenExpiry = localStorage.getItem('authTokenExpiry');

    if (storedToken && storedTokenExpiry) {
      const expiryTime = parseInt(storedTokenExpiry, 10);

      // Check if token is still valid
      if (Date.now() < expiryTime) {
        return storedToken;
      }
    }

    // Remove expired token
    this.clearStoredToken();
    return '';
  }

  login(formValue: any): Observable<string> {
    return this.http
      .post(this.loginUrl, formValue, { responseType: 'text' })
      .pipe(
        tap({
          next: (token) => {
            // Set token with expiration (5 minutes from now)
            const expiryTime = Date.now() + 300000; // 5 minutes in milliseconds

            localStorage.setItem('authToken', token);
            localStorage.setItem('authTokenExpiry', expiryTime.toString());

            this.accessToken.set(token);

            // Set up automatic token expiration
            this.scheduleTokenExpiration();
          },
          error: (error) => {
            this.clearStoredToken();
            this.accessToken.set('');
          },
        })
      );
  }

  // Schedule automatic token expiration
  private scheduleTokenExpiration() {
    // Clear any existing timeout
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    // Set a new timeout
    this.tokenExpirationTimer = setTimeout(() => {
      this.clearStoredToken();
      this.accessToken.set('');
    }, 300000); // 5 minutes
  }

  // Clear stored token
  private clearStoredToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiry');
  }

  logout() {
    this.clearStoredToken();
    this.accessToken.set('');

    // Clear the expiration timer
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  // Property to store timeout reference
  private tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;
}
