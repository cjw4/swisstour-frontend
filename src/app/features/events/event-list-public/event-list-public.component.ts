import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../api/services';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs';
import { EventDto } from '../../../api/models';
import { AsyncPipe } from '@angular/common';
import { APP_SETTINGS } from '../../../app.settings';
import { TranslateModule } from '@ngx-translate/core';
import { LocalLoadingIndicatorComponent } from '../../../shared/components/local-loading-indicator/local-loading-indicator.component';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
  selector: 'app-event-list-public',
  imports: [AsyncPipe, TranslateModule, LocalLoadingIndicatorComponent, EventCardComponent],
  templateUrl: './event-list-public.component.html',
  styleUrl: './event-list-public.component.css'
})
export class EventListPublicComponent implements OnInit {
  private eventService = inject(EventsService);
  private activatedRoute = inject(ActivatedRoute);

  events$: Observable<EventDto[]> | undefined;
  appSettings = inject(APP_SETTINGS);
  year: number = this.appSettings.eventYear;
  loading = signal(false);

  ngOnInit(): void {
    const yearParam = Number(this.activatedRoute.snapshot.paramMap.get('year'));
    if (yearParam) {
      this.year = yearParam;
    }

    this.loading.set(true);
    this.events$ = this.eventService.getEvents({ year: this.year }).pipe(finalize(() => this.loading.set(false)));
  }
}
