import { inject, Injectable } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { BannerInfo } from '../interfaces/banner-info';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  private eventsUrl = inject(APP_SETTINGS).apiUrl + '/events';
  http = inject(HttpClient);
  bannerInfo: BannerInfo = {
    message: ``,
    visible: true,
    type: 'info',
  };

  addResults(id: number | null): Observable<BannerInfo> {
    const url = `${this.eventsUrl}/results/${id}`;
    return this.http.post(url, undefined).pipe(
      map(() => ({
        message: `Results were added for event ${id}.`,
        visible: true,
        type: 'info' as const,
      })),
      catchError((error) =>
        of({
          message: `Results were not able to be added: ${error.value.message}`,
          visible: true,
          type: 'error' as const,
        })
      )
    );
  }
}
