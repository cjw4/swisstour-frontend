import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../interfaces/player';
import { PlayerStatistics } from '../interfaces/player-stats';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PlayerDetailsData } from './player-details.resolver';
import { OrdinalPipe } from "../pipes/ordinal.pipe";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-player-details',
  imports: [AsyncPipe, OrdinalPipe, TranslateModule],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.css',
})
export class PlayerDetailsComponent implements OnInit {
  // inject dependencies
  private activatedRoute = inject(ActivatedRoute);

  // variables
  player$: Observable<Player> | undefined;
  swisstourStats: PlayerStatistics | undefined;
  swissChampionshipStats: PlayerStatistics | undefined;
  swisstourDivisions: string[] | undefined;
  swissChampionshipDivisions: string[] | undefined;
  expandedSwisstour = signal(false);
  expandedSwisstourWins = signal(false);
  expandedSwisstourPodiums = signal(false);
  expandedSwisstourTop5s = signal(false);
  expandedSwisstourTop10s = signal(false);

  expandedChampionship = signal(false);
  expandedChampionshipWins = signal(false);
  expandedChampionshipPodiums = signal(false);
  expandedChampionshipTop5s = signal(false);
  expandedChampionshipTop10s = signal(false);

  // methods
  toggleSwisstour(cat: string) {
    switch (cat) {
      case 'tournaments':
        this.expandedSwisstour.update(v => !v);
        break;
      case 'wins':
        this.expandedSwisstourWins.update(v => !v);
        break;
      case 'podiums':
        this.expandedSwisstourPodiums.update(v => !v);
        break;
      case 'top5s':
        this.expandedSwisstourTop5s.update(v => !v);
        break;
      case 'top10s':
        this.expandedSwisstourTop10s.update(v => !v);
        break;
    }
  }

  toggleChampionship(cat: string) {
    switch (cat) {
      case 'tournaments':
        this.expandedChampionship.update(v => !v);
        break;
      case 'wins':
        this.expandedChampionshipWins.update(v => !v);
        break;
      case 'podiums':
        this.expandedChampionshipPodiums.update(v => !v);
        break;
      case 'top5s':
        this.expandedChampionshipTop5s.update(v => !v);
        break;
      case 'top10s':
        this.expandedChampionshipTop10s.update(v => !v);
        break;
    }
  }

  // lifecycle hooks
  ngOnInit(): void {
    const data = this.activatedRoute.snapshot.data['data'] as PlayerDetailsData;
    this.player$ = of(data.player);
    this.swisstourStats = data.swisstourStats;
    this.swisstourDivisions = Object.keys(data.swisstourStats);
    this.swissChampionshipStats = data.swissChampionshipStats;
    this.swissChampionshipDivisions = Object.keys(data.swissChampionshipStats);
  }
}
