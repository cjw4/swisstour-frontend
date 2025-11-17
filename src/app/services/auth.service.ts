import { computed, inject, Injectable, signal } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // inject dependencies
  private http = inject(HttpClient);

  // signals
  private accessToken = signal('');
  adminLoggedIn = computed(() => this.accessToken() !== '');

  // variables
  private loginUrl = inject(APP_SETTINGS).baseUrl + '/login';

  // functions
  login(username: string, password: string): Observable<string> {
    return this.http
      .post(this.loginUrl, { username: username, password: password }, { responseType: 'text'})
      .pipe(
        tap({
          next: (token) => {
            console.log('Received token:', token);
            if (token) {
              this.accessToken.set(token);
            } else {
              console.warn('Received empty token');
            }
          },
          error: (error) => {
            console.error('Login error:', error);
            // Optionally reset the token on error
            this.accessToken.set('');
          },
        })
      );
  }

  logout() {
    this.accessToken.set('');
  }

  testLogin(event?: Event) {
    if (event) {
      event.preventDefault()
    }
    this.login('swiss-dg-admin', 'sw1SSt0ur').subscribe({
      next: () => console.log("success"),
      error: () => console.log("error")
    });
  }
}
