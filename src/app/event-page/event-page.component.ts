import { Component, inject, OnInit } from '@angular/core';
import { EventListComponent } from '../event-list/event-list.component';
import { EventCreateComponent } from '../event-create/event-create.component';
import { Observable } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';
import { AsyncPipe } from '@angular/common';
import { EventsService } from '../services/events.service';
import { BannerComponent } from '../banner/banner.component';
import { BannerInfo } from '../interfaces/banner-info';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-event-page',
  imports: [
    AsyncPipe,
    EventListComponent,
    EventCreateComponent,
  ],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.css',
})
export class EventPageComponent implements OnInit {
  // services
  private eventService = inject(EventsService);
  private resultsService = inject(ResultsService);

  // observables
  event$: Observable<PdgaEvent> | undefined;
  events$: Observable<PdgaEvent[]> | undefined;

  // lifecycle hooks
  ngOnInit(): void {
    this.getEvents();
  }

  // functions
  getEvents() {
    this.events$ = this.eventService.getEvents();
  }

  getEvent(id: number) {
    this.event$ = this.eventService.getEvent(id);
  }

  deleteEvent(pdgaEvent: PdgaEvent) {
    this.eventService.deleteEvent(pdgaEvent);
    this.getEvents();
  }

  addResults(id: number | null) {
    this.resultsService.addResults(id).subscribe({
      next: (bannerInfo) => {
        this.bannerInfo = bannerInfo;
        this.getEvents();
      },
    });
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
