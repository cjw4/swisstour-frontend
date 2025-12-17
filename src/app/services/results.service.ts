import { inject, Injectable } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BannerInfo } from '../interfaces/banner-info';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  private eventsUrl = environment.apiUrl + '/events';
  authService = inject(AuthService);
  http = inject(HttpClient);
  bannerInfo: BannerInfo = {
    message: ``,
    visible: true,
    type: 'info',
  };

  addResults(id: number | null): Observable<BannerInfo> {
    const url = `${this.eventsUrl}/results/${id}`;
    const options = {
      headers: new HttpHeaders({
      Authorization: `Bearer ${this.authService.accessToken()}`
        }),
      };
    return this.http.post(url, undefined, options).pipe(
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
