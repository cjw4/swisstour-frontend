import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateRange',
  standalone: true
})
export class DateRangePipe implements PipeTransform {
  transform(startDate: string | undefined, endDate: string | undefined): string {
    if (!startDate) {
      return '';
    }

    const start = new Date(startDate);
    const startDay = start.getDate();
    const startMonth = start.toLocaleDateString('en-US', { month: 'long' });

    if (!endDate || endDate == startDate) {
      return `${startMonth} ${startDay}`;
    }

    const end = new Date(endDate);
    const endDay = end.getDate();
    const endMonth = end.toLocaleDateString('en-US', { month: 'long' });

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  }
}
