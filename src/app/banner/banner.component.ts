import { Component, EventEmitter, input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerInfo } from '../interfaces/banner-info';

@Component({
  selector: 'app-banner',
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  bannerInfo = input<BannerInfo>();
  close = output();

  closeBanner() {
    this.close.emit();
  }
}
