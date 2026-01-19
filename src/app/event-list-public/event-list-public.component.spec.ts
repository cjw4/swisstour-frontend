import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListPublicComponent } from './event-list-public.component';

describe('EventListPublicComponent', () => {
  let component: EventListPublicComponent;
  let fixture: ComponentFixture<EventListPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventListPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
