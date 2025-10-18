import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';
import { APP_SETTINGS } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private eventsUrl = inject(APP_SETTINGS).apiUrl + '/events';
  http = inject(HttpClient);

  getEvents(): Observable<PdgaEvent[]> {
    return this.http.get<PdgaEvent[]>(this.eventsUrl);
  };
}
