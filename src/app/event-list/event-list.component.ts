import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';
import { HttpClient } from '@angular/common/http';
import { EventCreateComponent } from "../event-create/event-create.component";
import { APP_SETTINGS, appSettings } from '../app.settings';
import { BannerComponent } from '../banner/banner.component';
import { BannerInfo } from '../interfaces/banner-info';
import { signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-event-list',
  imports: [
    EventCreateComponent,
    BannerComponent,
    AsyncPipe
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
  providers: [
    { provide: APP_SETTINGS, useValue: appSettings }
  ]
})

export class EventListComponent implements OnInit {
  private eventService: EventsService;

  constructor() {
    this.eventService = new EventsService();
  }

  http = inject(HttpClient);
  settings = inject(APP_SETTINGS);
  events$: Observable<PdgaEvent[]> | undefined;
  private eventsUrl = this.settings.apiUrl + '/events';

  bannerInfo : BannerInfo | undefined;

  public createBanner(bannerInfo: BannerInfo) {
    this.bannerInfo = {
      message: bannerInfo.message,
      visible: bannerInfo.visible,
      type: bannerInfo.type
    }
  }

  public closeBanner() {
    this.bannerInfo = {
      message: '',
      visible: false,
      type: 'success'
    }
  }

  refreshEvents() {
    this.getEvents();
  }

  public getEvents() {
    this.events$ = this.eventService.getEvents();
  }

  public addResults(id: number) {
    const url = `${this.eventsUrl}/results/${id}`;
    this.http.post(url, undefined).subscribe({
      next: () => {
        this.bannerInfo = {
          message: "Event results added.",
          visible: true,
          type: 'success'
        };
      },
      error: (err) => {
        this.bannerInfo = {
          message: "Event results could not be added.",
          visible: true,
          type: 'error'
        };
      }
    });
  }

  public deleteEvent(event: PdgaEvent) {
    if (confirm(`Are you sure you want to delete pdga event ${event.id}?`)) {
      const url = `${this.eventsUrl}/${event.id}`;
      this.http.delete(url).subscribe({
        next: (res) => {
          this.getEvents(); // Refresh the event list after deletion
          this.bannerInfo = {
            message: `PDGA event was deleted.`,
            visible: true,
            type: 'info'
          }
        },
        error: (err) => {
          console.error('Error deleting event:', err.error.message);
        }
      });
    }
  }

  ngOnInit(): void {
    this.getEvents();
  }
}
