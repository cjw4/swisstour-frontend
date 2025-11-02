import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';
import { HttpClient } from '@angular/common/http';
import { EventCreateComponent } from "../event-create/event-create.component";
import { APP_SETTINGS, appSettings } from '../app.settings';
import { BannerComponent } from '../banner/banner.component';
import { BannerInfo } from '../interfaces/banner-info';
import { AsyncPipe } from '@angular/common';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-event-list',
  imports: [EventCreateComponent, BannerComponent, AsyncPipe],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class EventListComponent implements OnInit {
  // inject services
  private eventService = inject(EventsService);
  private resultsService = inject(ResultsService);

  // observables
  event$: Observable<PdgaEvent> | undefined;
  events$: Observable<PdgaEvent[]> | undefined;

  // lifecylce hooks
  ngOnInit(): void {
    this.getEvents();
  }

  // event functions
  public getEvents() {
    this.events$ = this.eventService.getEvents();
  }

  public getEvent(id: number) {
    this.event$ = this.eventService.getEvent(id);
  }

  public addResults(id: number) {
    this.resultsService.addResults(id).subscribe({
      next: (bannerInfo) => {
        this.bannerInfo = bannerInfo;
      },
    });
  }

  public deleteEvent(event: PdgaEvent) {
    if (confirm(`Are you sure you want to delete pdga event ${event.id}?`)) {
      this.eventService.deleteEvent(event).subscribe({
        next: (bannerInfo) => {
          this.bannerInfo = bannerInfo;
          this.getEvents();
        },
      });
    }
  }

  // banner
  bannerInfo: BannerInfo | undefined;
  public createBanner(bannerInfo: BannerInfo) {
    this.bannerInfo = {
      message: bannerInfo.message,
      visible: bannerInfo.visible,
      type: bannerInfo.type,
    };
  }

  public closeBanner() {
    this.bannerInfo = {
      message: '',
      visible: false,
      type: 'success',
    };
  }
}
