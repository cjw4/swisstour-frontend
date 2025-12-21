import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { StandingsDTO } from '../interfaces/standings-dto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StandingsService {
  http = inject(HttpClient);
  settings = inject(APP_SETTINGS);

  getStanding(year: number | undefined, category: string | null) : Observable<StandingsDTO[]> {
    const standingsUrl = environment.apiUrl + '/standings/' + year + '/' + category;
    return this.http.get<StandingsDTO[]>(standingsUrl)
  }

}
