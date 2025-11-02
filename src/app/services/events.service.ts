import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';
import { APP_SETTINGS } from '../app.settings';
import { BannerInfo } from '../interfaces/banner-info';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private eventsUrl = inject(APP_SETTINGS).apiUrl + '/events';
  http = inject(HttpClient);
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

  deleteEvent(event: PdgaEvent): Observable<BannerInfo> {
    const url = `${this.eventsUrl}/${event.id}`;
    return this.http.delete(url).pipe(
      map(() => ({
        message: `PDGA event was deleted.`,
        visible: true,
        type: 'info' as const,
      })),
      catchError((error) =>
        of({
          message: `PDGA event was not deleted: ${error.message}`,
          visible: true,
          type: 'error' as const,
        })
      )
    );
  }
}
