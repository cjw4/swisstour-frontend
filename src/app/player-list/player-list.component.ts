import { Component, inject, OnInit } from '@angular/core';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-player-list',
  imports: [AsyncPipe],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class PlayerListComponent implements OnInit {
  private playerService: PlayerService;

  constructor() {
    this.playerService = new PlayerService();
  }

  http = inject(HttpClient);
  settings = inject(APP_SETTINGS);
  playersUrl = this.settings.apiUrl + '/players';
  players$: Observable<Player[]> | undefined;

  private getPlayers() {
    this.players$ = this.playerService.getPlayers();
  }

  ngOnInit(): void {
    this.getPlayers();
  }
}
