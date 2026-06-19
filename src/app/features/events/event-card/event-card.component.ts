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

  cardClasses = computed(() => ({
    'bg-gray-100 opacity-60': this.isPast(),
    'bg-green-50': !this.isPast() && this.isThisWeek(),
    'bg-gradient-to-r from-amber-50 to-white border-l-4 border-amber-500':
      !this.isPast() && !this.isThisWeek() && this.isHighlighted(),
    'bg-white': !this.isPast() && !this.isThisWeek() && !this.isHighlighted()
  }));

  toggle(): void {
    this.isExpanded.update((v) => !v);
  }
}
