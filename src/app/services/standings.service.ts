import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { StandingsDTO } from '../interfaces/standings-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StandingsService {
  http = inject(HttpClient);
  settings = inject(APP_SETTINGS);

  getStanding(category: string | null) : Observable<StandingsDTO[]> {
    const standingsUrl = this.settings.apiUrl + '/standings/' + this.settings.currentYear + '/' + category;
    return this.http.get<StandingsDTO[]>(standingsUrl)
  }

}
