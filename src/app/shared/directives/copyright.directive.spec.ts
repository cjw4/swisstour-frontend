import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CopyrightDirective } from './copyright.directive';
import { TranslateService } from '@ngx-translate/core';

@Component({
  template: '<div appCopyright></div>',
  imports: [CopyrightDirective]
})
class TestHostComponent {}

const translateServiceMock = {
  stream: jasmine.createSpy('stream').and.returnValue(of(''))
};

describe('CopyrightDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: TranslateService, useValue: translateServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
