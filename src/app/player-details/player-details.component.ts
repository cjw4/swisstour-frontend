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
  expandedSwisstour = signal<boolean | null>(null);
  expandedSwisstourWins = signal<boolean | null>(null);
  expandedSwisstourPodiums = signal<boolean | null>(null);
  expandedSwisstourTop5s = signal<boolean | null>(null);
  expandedSwisstourTop10s = signal<boolean | null>(null);

  expandedChampionship = signal<boolean | null>(null);
  expandedChampionshipWins = signal<boolean | null>(null);
  expandedChampionshipPodiums = signal<boolean | null>(null);
  expandedChampionshipTop5s = signal<boolean | null>(null);
  expandedChampionshipTop10s = signal<boolean | null>(null);

  // methods
  toggleSwisstour(cat: string) {
    switch (cat) {
      case 'tournaments':
        this.expandedSwisstour.set(
          this.expandedSwisstour() === true ? false : true
        );
        break;
      case 'wins':
        this.expandedSwisstourWins.set(
          this.expandedSwisstourWins() === true ? false : true
        );
        break;
      case 'podiums':
        this.expandedSwisstourPodiums.set(
          this.expandedSwisstourPodiums() === true ? false : true
        );
        break;
      case 'top5s':
        this.expandedSwisstourTop5s.set(
          this.expandedSwisstourTop5s() === true ? false : true
        );
        break;
      case 'top10s':
        this.expandedSwisstourTop10s.set(
          this.expandedSwisstourTop10s() === true ? false : true
        );
        break;
    }
  }

  toggleChampionship(cat: string) {
    switch (cat) {
      case 'tournaments':
        this.expandedChampionship.set(
          this.expandedChampionship() === true ? false : true
        );
        break;
      case 'wins':
        this.expandedChampionshipWins.set(
          this.expandedChampionshipWins() === true ? false : true
        );
        break;
      case 'podiums':
        this.expandedChampionshipPodiums.set(
          this.expandedChampionshipPodiums() === true ? false : true
        );
        break;
      case 'top5s':
        this.expandedChampionshipTop5s.set(
          this.expandedChampionshipTop5s() === true ? false : true
        );
        break;
      case 'top10s':
        this.expandedChampionshipTop10s.set(
          this.expandedChampionshipTop10s() === true ? false : true
        );
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
