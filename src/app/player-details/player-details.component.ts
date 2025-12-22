import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../interfaces/player';
import { DivisionStats } from '../interfaces/division-stats';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PlayerDetailsData } from './player-details.resolver';

@Component({
  selector: 'app-player-details',
  imports: [AsyncPipe],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.css',
})
export class PlayerDetailsComponent implements OnInit {
  // inject dependencies
  private activatedRoute = inject(ActivatedRoute);

  // variables
  player$: Observable<Player> | undefined;
  swisstourStats: DivisionStats | undefined;
  swissChampionshipStats: DivisionStats | undefined;
  swisstourDivisions: string[] | undefined;
  swissChampionshipDivisions: string[] | undefined;

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
