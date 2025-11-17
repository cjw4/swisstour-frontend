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
  login(formValue: any): Observable<string> {
    return this.http
      .post(this.loginUrl, formValue, { responseType: 'text'})
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

}
