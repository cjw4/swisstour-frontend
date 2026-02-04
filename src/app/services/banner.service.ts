import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum BannerType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info'
}

export interface BannerMessage {
  message: string;
  type: BannerType;
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private bannerSubject = new BehaviorSubject<BannerMessage | null>(null);
  bannerMessage$ = this.bannerSubject.asObservable();

  updateBanner(message: string, type: BannerType = BannerType.INFO) {
    this.bannerSubject.next({ message, type });
  }

  clearBanner() {
    this.bannerSubject.next(null);
  }
}
