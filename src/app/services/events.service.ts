import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';
import { APP_SETTINGS } from '../app.settings';
import { BannerInfo } from '../interfaces/banner-info';
import { BannerService, BannerType } from './banner.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private eventsUrl = inject(APP_SETTINGS).apiUrl + '/events';
  http = inject(HttpClient);
  bannerService = inject(BannerService);

  bannerInfo: BannerInfo = {
    message: ``,
    visible: true,
    type: 'info',
  };

  getEvents(): Observable<PdgaEvent[]> {
    return this.http.get<PdgaEvent[]>(this.eventsUrl);
  }

  getEvent(id: number): Observable<PdgaEvent> {
    return this.http.get<PdgaEvent>(this.eventsUrl + '/' + id);
  }

  deleteEvent(event: PdgaEvent): void {
    const url = `${this.eventsUrl}/${event.id}`;
    this.http.delete(url).subscribe({
      next: res => {
        this.bannerService.updateBanner('PDGA event was deleted.', BannerType.SUCCESS);
      }
    });
  }
}
