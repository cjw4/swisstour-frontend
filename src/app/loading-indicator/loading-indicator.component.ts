import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-indicator',
  imports: [AsyncPipe, NgTemplateOutlet, MatProgressSpinnerModule],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.css',
})
export class LoadingIndicatorComponent {
  // inject dependencies
  private loadingService = inject(LoadingService);

  loading$: Observable<boolean> | null = null;

  constructor() {
    this.loading$ = this.loadingService.loading$;
  }

  @ContentChild('loading')
  customLoadingIndicator: TemplateRef<any> | null = null;

}
