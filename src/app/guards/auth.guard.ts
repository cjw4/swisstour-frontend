import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BannerService } from '../services/banner.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const bannerService = inject(BannerService);

  if (authService.adminLoggedIn()) {
    return true;
  }
  bannerService.updateBanner("Please log in to access that page.")
  return router.parseUrl('admin/login')
};
