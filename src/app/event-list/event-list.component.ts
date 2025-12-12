import { Component, inject, input, OnInit, output } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { AsyncPipe, NgClass } from '@angular/common';
import { ResultsService } from '../services/results.service';
import { Router } from '@angular/router';
import { BannerService, BannerType } from '../services/banner.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-event-list',
  imports: [NgClass, AsyncPipe],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class EventListComponent implements OnInit {
  // inject services
  private eventService = inject(EventsService);
  private resultsService = inject(ResultsService);
  private bannerService = inject(BannerService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  // inputs and outputs
  events = input<PdgaEvent[]>();
  addedResults = output<number | null>();
  deletedEvent = output<PdgaEvent>();
  selectedEvent = output<number>();

  // observables
  event$: Observable<PdgaEvent> | undefined;
  events$: Observable<PdgaEvent[]> | undefined;

  // lifecycle hooks
  ngOnInit(): void {
    this.events$ = this.eventService.getEvents();
  }

  // functions
  addEvent() {
    this.router.navigate(['/event/input'])
  }

  editEvent(id: number) {
    this.router.navigate(['/event/input', id])
  }

  public getEvent(id: number) {
    this.selectedEvent.emit(id);
  }

  public addResults(id: number) {
    // start loader
    this.loadingService.loadingOn();
    this.resultsService.addResults(id).subscribe({
      next: (res) => {
      this.bannerService.updateBanner(`Result ${res} was saved`, BannerType.SUCCESS);
      this.events$ = this.eventService.getEvents();
      this.loadingService.loadingOff();
    },
      error: (err) => {
        this.bannerService.updateBanner(`There was an error adding the results: ${err}`, BannerType.ERROR);
        this.loadingService.loadingOff();
      }
    });
  }

  public deleteEvent(event: PdgaEvent) {
    if (confirm(`Are you sure you want to delete pdga event ${event.id}?`)) {
      this.events$ = this.eventService.deleteEvent(event);
    }
  }
}
