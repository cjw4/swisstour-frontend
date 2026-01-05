import { Component, inject, input, OnInit, output, Signal, signal } from '@angular/core';
import { EventsService } from '../services/events.service';
import { map, Observable } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { AsyncPipe, NgClass } from '@angular/common';
import { ResultsService } from '../services/results.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  private activatedRoute = inject(ActivatedRoute);
  private loadingService = inject(LoadingService);
  appSettings = inject(APP_SETTINGS)

  // inputs and outputs
  events = input<PdgaEvent[]>();
  addedResults = output<number | null>();
  deletedEvent = output<PdgaEvent>();
  selectedEvent = output<number>();

  // variables
  year = signal<number | undefined>(undefined);

  // observables
  allYears = signal<number[]>([]);
  event$: Observable<PdgaEvent> | undefined;
  events$: Observable<PdgaEvent[]> | undefined;

  // lifecycle hooks
  ngOnInit(): void {
    // Get unique event years first
    this.eventService.getEvents(undefined, null).pipe(
      map((response) => {
        const years = response.map(e => e.year);
        return Array.from(new Set(years));
      })
    ).subscribe(years => {
      this.allYears.set(years);

      // Now that allYears is set, handle the year logic
      const yearParam = this.activatedRoute.snapshot.paramMap.get('year');
      if (yearParam) {
        this.year.set(Number(yearParam));
        this.events$ = this.eventService.getEvents(this.year(), null);
      } else {
        // Set to the latest year from allYears (assuming that's your intent)
        this.year.set(this.appSettings.currentYear);
        this.events$ = this.eventService.getEvents(this.year(), null);
      }
    });
  }

  // functions
  addEvent() {
    this.router.navigate(['/event/input']);
  }

  editEvent(id: number) {
    this.router.navigate(['/event/input', id]);
  }

  public getEvent(id: number) {
    this.selectedEvent.emit(id);
  }

  public addResults(id: number) {
    // start loader
    this.loadingService.loadingOn();
    this.resultsService.addResults(id).subscribe({
      next: (res) => {
        this.bannerService.updateBanner(
          res.message,
          BannerType.SUCCESS
        );
        this.events$ = this.eventService.getEvents(this.year(), null);
        this.loadingService.loadingOff();
      },
      error: (err) => {
        this.bannerService.updateBanner(
          `There was an error adding the results: ${err}`,
          BannerType.ERROR
        );
        this.loadingService.loadingOff();
      },
    });
  }

  public deleteEvent(event: PdgaEvent) {
    if (confirm(`Are you sure you want to delete pdga event ${event.id}?`)) {
      this.events$ = this.eventService.deleteEvent(event, this.year());
    }
  }

  onYearChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.year.set(Number(selectElement.value));
    this.router.navigate(['/events', this.year()]);
    this.events$ = this.eventService.getEvents(this.year(), null);
  }
}
