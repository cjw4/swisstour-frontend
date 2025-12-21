import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { BannerService, BannerType } from '../services/banner.service';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class LoginComponent {
  // inject dependencies
  bannerService = inject(BannerService);
  authService = inject(AuthService);
  router = inject(Router);
  loadingService = inject(LoadingService);
  http = inject(HttpClient);
  settings = inject(APP_SETTINGS);

  private loginUrl = environment.apiUrl + '/auth/login';

  // create form
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formValue = this.loginForm.value;

    // enable loader
    this.loadingService.loadingOn();

    this.authService.login(formValue).subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.bannerService.updateBanner('Login successful', BannerType.SUCCESS);
        this.loadingService.loadingOff();
      },
      error: (err: HttpErrorResponse) => {
        this.bannerService.updateBanner(
          `Login failed: ${err.error?.message || 'Invalid credentials'}`,
          BannerType.ERROR
        );
        this.loadingService.loadingOff();
      },
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
