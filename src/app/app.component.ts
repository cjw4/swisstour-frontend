import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BannerComponent } from './shared/components/banner/banner.component';
import { LoadingIndicatorComponent } from './shared/components/loading-indicator/loading-indicator.component';
import { CopyrightDirective } from './shared/directives/copyright.directive';
import { APP_SETTINGS } from './app.settings';
import { AuthService } from './core/auth/auth.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    BannerComponent,
    NavbarComponent,
    LoadingIndicatorComponent,
    CopyrightDirective,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  settings = inject(APP_SETTINGS);
  authService = inject(AuthService);
  title = 'Swisstour';
}
