import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-local-loading-indicator',
  imports: [MatProgressSpinnerModule],
  templateUrl: './local-loading-indicator.component.html',
  styleUrl: './local-loading-indicator.component.css'
})
export class LocalLoadingIndicatorComponent {
  loading = input.required<boolean>();
}
