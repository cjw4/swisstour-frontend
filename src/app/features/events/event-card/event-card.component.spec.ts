import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EventDto } from '../../../api/models/event-dto';
import { EventCardComponent } from './event-card.component';

const baseEventDto: EventDto = {
  isChampionship: false,
  isSwisstour: true,
  points: 0,
  displayName: 'Test Event',
  startDate: '2026-08-01',
  endDate: '2026-08-03',
  city: 'Zürich',
  swisstourType: 'Pro'
};

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('eventDto', baseEventDto);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('image', () => {
    const cases: { type: string; path: string }[] = [
      { type: 'Pro', path: '/assets/images/tour_logo_200.png' },
      { type: 'Challenger_50', path: '/assets/images/tour_logo_50.png' },
      { type: 'Challenger', path: '/assets/images/tour_logo_100.png' },
      { type: 'Championship', path: '/assets/images/tour_logo_250_c.png' },
      { type: 'Finals', path: '/assets/images/tour_logo_250_f.png' }
    ];

    for (const { type, path } of cases) {
      it(`shows the correct image for swisstourType "${type}"`, () => {
        fixture.componentRef.setInput('eventDto', { ...baseEventDto, swisstourType: type });
        fixture.detectChanges();
        const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
        expect(img).toBeTruthy();
        expect(img.getAttribute('src')).toBe(path);
      });
    }

    it('shows no image when swisstourType is undefined', () => {
      fixture.componentRef.setInput('eventDto', { ...baseEventDto, swisstourType: undefined });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('img')).toBeNull();
    });
  });

  describe('displayName', () => {
    it('renders the event displayName', () => {
      fixture.componentRef.setInput('eventDto', { ...baseEventDto, displayName: 'Swiss Open 2026' });
      fixture.detectChanges();
      const p = fixture.nativeElement.querySelector('p') as HTMLElement;
      expect(p.textContent?.trim()).toBe('Swiss Open 2026');
    });
  });
});
