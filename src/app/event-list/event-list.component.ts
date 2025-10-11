import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { PdgaEvent } from '../pdga-event';
import { HttpClient } from '@angular/common/http';
import { EventCreateComponent } from "../event-create/event-create.component";
import { APP_SETTINGS, appSettings } from '../app.settings';
import { BannerComponent } from '../banner/banner.component';
import { BannerInfo } from '../interfaces/banner-info';

@Component({
  selector: 'app-event-list',
  imports: [
    EventCreateComponent,
    BannerComponent
  ],
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

  public getEvents() {
    this.http.get(this.eventsUrl).subscribe((result) => this.events = result);
  }

  public deleteEvent(id: number) {
    if (confirm("Are you sure you want to delete this event?")) {
      const url = `${this.eventsUrl}/${id}`;
      this.http.delete(url).subscribe({
        next: (res) => {
          this.getEvents(); // Refresh the event list after deletion
          this.bannerInfo = {
            message: "Event deleted.",
            visible: true,
            type: 'success'
          }
        },
        error: (err) => {
          console.error('Error deleting event:', err);
        }
      });
    }
  }

  ngOnInit(): void {
    this.getEvents();
  }
}
