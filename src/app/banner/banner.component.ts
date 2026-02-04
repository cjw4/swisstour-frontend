import { ChangeDetectorRef, Component, EventEmitter, inject, input, OnInit, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerInfo } from '../interfaces/banner-info';
import { BannerService, BannerMessage } from '../services/banner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-banner',
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent implements OnInit {
  // inject service
  bannerService = inject(BannerService);
  private cdr = inject(ChangeDetectorRef);

  // variables
  currentBanner: BannerMessage | null = null;
  private subscription: Subscription | null = null;
  private autoDismissTimeout: ReturnType<typeof setTimeout> | null = null;

  // lifecycle hooks
  ngOnInit(): void {
    this.subscription = this.bannerService.bannerMessage$
      .subscribe(banner => {
        if (this.autoDismissTimeout) {
          clearTimeout(this.autoDismissTimeout);
          this.autoDismissTimeout = null;
        }
        this.currentBanner = banner;
        if (banner) {
          this.autoDismissTimeout = setTimeout(() => {
            this.closeBanner();
            this.cdr.detectChanges();
          }, 3000);
        }
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.autoDismissTimeout) {
      clearTimeout(this.autoDismissTimeout);
    }
  }

  bannerInfo = input<BannerInfo>();
  close = output();

  closeBanner() {
    this.bannerService.clearBanner();
  }
}
