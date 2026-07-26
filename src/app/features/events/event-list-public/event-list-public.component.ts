import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../api/services';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs';
import { EventDto } from '../../../api/models';

interface MonthGroup {
  key: string;
  label: string;
  events: EventDto[];
}
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

  groupedEvents$: Observable<MonthGroup[]> | undefined;
  appSettings = inject(APP_SETTINGS);
  year: number = this.appSettings.eventYear;
  loading = signal(false);

  ngOnInit(): void {
    const yearParam = Number(this.activatedRoute.snapshot.paramMap.get('year'));
    if (yearParam) {
      this.year = yearParam;
    }

    this.loading.set(true);
    this.groupedEvents$ = this.eventService.getEvents({ year: this.year }).pipe(
      finalize(() => this.loading.set(false)),
      map((events) => this.groupByMonth(events))
    );
  }

  private groupByMonth(events: EventDto[]): MonthGroup[] {
    const groups = new Map<string, MonthGroup>();
    for (const event of events) {
      const date = event.startDate ? new Date(event.startDate) : null;
      const key = date ? `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}` : 'zzzz-unknown';
      let group = groups.get(key);
      if (!group) {
        group = {
          key,
          label: date ? date.toLocaleDateString('en-US', { month: 'long' }) : '',
          events: []
        };
        groups.set(key, group);
      }
      group.events.push(event);
    }
    return [...groups.values()].sort((a, b) => a.key.localeCompare(b.key));
  }
}
