import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private eventsUrl = 'http://localhost:8080/api/events';
  http = inject(HttpClient);

  getEvents() {
    return this.http.get(this.eventsUrl);
  };
}
