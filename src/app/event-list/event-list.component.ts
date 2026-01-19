import { ChangeDetectorRef, Component, inject, input, OnInit, output, Signal, signal } from '@angular/core';
import { EventsService } from '../api/services/events.service';
import { map, Observable } from 'rxjs';
import { EventDto } from '../api/models/event-dto';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { ResultsService } from '../services/results.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerService, BannerType } from '../services/banner.service';
import { LoadingService } from '../services/loading.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateRangePipe } from '../pipes/date-range.pipe';

@Component({
  selector: 'app-event-list',
  imports: [NgClass, AsyncPipe, TranslateModule, DateRangePipe],
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
  private translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  appSettings = inject(APP_SETTINGS)

  // inputs and outputs
  events = input<EventDto[]>();
  addedResults = output<number | null>();
  deletedEvent = output<EventDto>();
  selectedEvent = output<number>();

  // variables
  year = signal<number | undefined>(undefined);

  // observables
  allYears = signal<number[]>([]);
  event$: Observable<EventDto> | undefined;
  events$: Observable<EventDto[]> | undefined;

  // lifecycle hooks
  ngOnInit(): void {
    // Get unique event years first
    this.eventService.getEvents().pipe(
      map((response) => {
        const years = response.map(e => e.year!);
        return Array.from(new Set(years));
      })
    ).subscribe(years => {
      this.allYears.set(years);

      // Now that allYears is set, handle the year logic
      const yearParam = this.activatedRoute.snapshot.paramMap.get('year');
      if (yearParam) {
        this.year.set(Number(yearParam));
        this.events$ = this.eventService.getEventsByYear({ year: this.year()! });
      } else {
        // Set to the latest year from allYears (assuming that's your intent)
        this.year.set(this.appSettings.currentYear);
        this.events$ = this.eventService.getEventsByYear({ year: this.year()! });
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
        // res.message comes from the server, so we use it directly
        this.bannerService.updateBanner(
          res.message,
          BannerType.SUCCESS
        );
        this.events$ = this.eventService.getEventsByYear({ year: this.year()! });
        this.loadingService.loadingOff();
      },
      error: (err) => {
        const message = this.translateService.instant('banners.resultsSaveError', { error: err });
        this.bannerService.updateBanner(message, BannerType.ERROR);
        this.loadingService.loadingOff();
      },
    });
  }

  public deleteEvent(event: EventDto) {
    const confirmMessage = `${this.translateService.instant('eventList.deleteConfirm')} ${event.id}?`;
    if (confirm(confirmMessage)) {
      this.eventService.deleteEvent({ id: event.id! }).subscribe(() => {
        const message = this.translateService.instant('banners.eventDeleted');
        this.bannerService.updateBanner(message, BannerType.SUCCESS);
        this.events$ = this.eventService.getEventsByYear({ year: this.year()! });
        this.cdr.detectChanges();
      });
    }
  }

  onYearChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.year.set(Number(selectElement.value));
    this.router.navigate(['/events', this.year()]);
    this.events$ = this.eventService.getEventsByYear({ year: this.year()! });
  }
}
