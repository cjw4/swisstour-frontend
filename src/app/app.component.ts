import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BannerComponent } from './banner/banner.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { CopyrightDirective } from './directives/copyright.directive';
import { APP_SETTINGS, appSettings } from './app.settings';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    BannerComponent,
    NavbarComponent,
    LoadingIndicatorComponent,
    CopyrightDirective
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class AppComponent {
  settings = inject(APP_SETTINGS);
  authService = inject(AuthService);
}
