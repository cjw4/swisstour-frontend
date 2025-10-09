import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { PdgaEvent } from '../pdga-event';
import { HttpClient } from '@angular/common/http';
import { EventCreateComponent } from "../event-create/event-create.component";

@Component({
  selector: 'app-event-list',
  imports: [EventCreateComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
  providers: [EventsService]
})
export class EventListComponent implements OnInit {
  http = inject(HttpClient);
  events: any;
  private eventsUrl = 'http://localhost:8080/api/events';

  private getEvents() {
    this.http.get(this.eventsUrl).subscribe((result) => this.events = result);
  }

  ngOnInit(): void {
    this.getEvents();
  }
}
