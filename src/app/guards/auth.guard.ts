import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BannerService } from '../services/banner.service';
import { TranslateService } from '@ngx-translate/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const bannerService = inject(BannerService);
  const translateService = inject(TranslateService);

  if (authService.adminLoggedIn()) {
    return true;
  }
  const message = translateService.instant('banners.loginRequired');
  bannerService.updateBanner(message);
  return router.parseUrl('admin/login')
};
