import { Component, EventEmitter, inject, input, OnInit, output, Output } from '@angular/core';
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

  // variables
  currentBanner: BannerMessage | null = null;
  private subscription: Subscription | null = null;

  // lifecycle hooks
  ngOnInit(): void {
    this.subscription = this.bannerService.bannerMessage$
      .subscribe(banner => {
        this.currentBanner = banner;
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  bannerInfo = input<BannerInfo>();
  close = output();

  closeBanner() {
    this.bannerService.clearBanner();
  }
}
