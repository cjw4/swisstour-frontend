import { Component, computed, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { EventDto } from '../../../api/models/event-dto';
import { DateRangePipe } from '../../../shared/pipes/date-range.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-event-card',
  imports: [NgClass, DateRangePipe, TranslateModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  readonly eventDto = input.required<EventDto>();

  isExpanded = signal(false);

  private today = new Date().toISOString().split('T')[0];
  private weekStart = (() => {
    const d = new Date();
    const day = d.getDay();
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    return d.toISOString().split('T')[0];
  })();
  private weekEnd = (() => {
    const d = new Date();
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? 0 : 7 - day));
    return d.toISOString().split('T')[0];
  })();

  startDay = computed(() => {
    const start = this.eventDto().startDate;
    return start ? new Date(start).getDate() : null;
  });

  startMonthAbbr = computed(() => {
    const start = this.eventDto().startDate;
    return start ? new Date(start).toLocaleDateString('en-US', { month: 'short' }) : '';
  });

  endDay = computed(() => {
    const end = this.eventDto().endDate;
    return end ? new Date(end).getDate() : null;
  });

  endMonthAbbr = computed(() => {
    const end = this.eventDto().endDate;
    return end ? new Date(end).toLocaleDateString('en-US', { month: 'short' }) : '';
  });

  isMultiDay = computed(() => {
    const { startDate, endDate } = this.eventDto();
    return !!endDate && !!startDate && endDate !== startDate;
  });

  isSameMonth = computed(() => this.startMonthAbbr() === this.endMonthAbbr());

  imagePath = computed(() => {
    switch (this.eventDto().swisstourType) {
      case 'Pro':
        return '/assets/images/tour_logo_200.png';
      case 'Challenger_50':
        return '/assets/images/tour_logo_50.png';
      case 'Challenger':
        return '/assets/images/tour_logo_100.png';
      case 'Championship':
        return '/assets/images/tour_logo_250_c.png';
      case 'Finals':
        return '/assets/images/tour_logo_250_f.png';
      default:
        return '';
    }
  });

  isHighlighted = computed(() => {
    const type = this.eventDto().swisstourType;
    return type === 'Pro' || type === 'Championship' || type === 'Finals';
  });

  isPast = computed(() => {
    const end = this.eventDto().endDate;
    return !!end && end < this.today;
  });

  isThisWeek = computed(() => {
    const start = this.eventDto().startDate;
    return !!start && start >= this.weekStart && start <= this.weekEnd;
  });

  hasExpandableContent = computed(() => {
    const e = this.eventDto();
    if (this.isPast()) return !!e.eventId;
    return !!(e.registrationStart || e.infoLink || e.registrationLink || e.hasResults || e.eventId);
  });

  cardClasses = computed(() => {
    const past = this.isPast();
    const thisWeek = this.isThisWeek();
    const highlighted = this.isHighlighted();
    return {
      'bg-gray-300 opacity-75': past,
      'bg-green-50': !past && thisWeek,
      'bg-gradient-to-r from-amber-50 to-white': !past && !thisWeek && highlighted,
      'bg-white': !past && !thisWeek && !highlighted,
      'border-l-4 border-amber-500': highlighted
    };
  });

  toggle(): void {
    if (this.hasExpandableContent()) {
      this.isExpanded.update((v) => !v);
    }
  }
}
