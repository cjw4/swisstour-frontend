import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { PdgaEvent } from '../pdga-event';
import { HttpClient } from '@angular/common/http';
import { EventCreateComponent } from "../event-create/event-create.component";
import { APP_SETTINGS, appSettings } from '../app.settings';

@Component({
  selector: 'app-event-list',
  imports: [EventCreateComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
  providers: [
    { provide: APP_SETTINGS, useValue: appSettings }
  ]
})
export class EventListComponent implements OnInit {
  http = inject(HttpClient);
  settings = inject(APP_SETTINGS);
  events: any;
  private eventsUrl = this.settings.apiUrl + '/events';

  public getEvents() {
    this.http.get(this.eventsUrl).subscribe((result) => this.events = result);
  }

  ngOnInit(): void {
    this.getEvents();
  }
}
