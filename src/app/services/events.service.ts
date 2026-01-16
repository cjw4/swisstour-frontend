import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';
import { APP_SETTINGS } from '../app.settings';
import { BannerInfo } from '../interfaces/banner-info';
import { BannerService, BannerType } from './banner.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  // inject dependencies
  http = inject(HttpClient);
  bannerService = inject(BannerService);
  authService = inject(AuthService);
  translateService = inject(TranslateService);

  // variables
  private apiUrl = environment.apiUrl;
  private eventsUrl = this.apiUrl + '/events';
  // private eventsUrl = inject(APP_SETTINGS).apiUrl + '/events';
  bannerInfo: BannerInfo = {
    message: ``,
    visible: true,
    type: 'info',
  };

  getEvents(year: number | undefined, division: string | null): Observable<PdgaEvent[]> {
    if (division) {
      return this.http.get<PdgaEvent[]>(this.eventsUrl + '/year/' + year + '?division=' + division);
    } else if (year) {
      return this.http.get<PdgaEvent[]>(this.eventsUrl + '/year/' + year);
    } else {
      return this.http.get<PdgaEvent[]>(this.eventsUrl);
    }
  }

  getEvent(id: number): Observable<PdgaEvent> {
    return this.http.get<PdgaEvent>(this.eventsUrl + '/' + id);
  }

  deleteEvent(event: PdgaEvent, year: any): Observable<PdgaEvent[]> {
    const url = `${this.eventsUrl}/${event.id}`;
    return this.http.delete(url).pipe(
      tap(() => {
        const message = this.translateService.instant('banners.eventDeleted');
        this.bannerService.updateBanner(message, BannerType.SUCCESS);
      }),
      switchMap(() => this.getEvents(Number(year), null))
    );
  }
}
