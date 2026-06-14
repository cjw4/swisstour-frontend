import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CATEGORIES } from '../../../shared/constants/categories.constant';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaders',
  imports: [LeaderboardComponent, CommonModule],
  templateUrl: './leaders.component.html',
  styleUrl: './leaders.component.css'
})
export class LeadersComponent {
  private activatedRoute = inject(ActivatedRoute);

  categories = CATEGORIES;
  year: number | undefined;

  constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.year = Number(params.get('year'));
    });
  }
}
