import { Component, inject, OnInit } from '@angular/core';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { AsyncPipe } from '@angular/common';
import { PlayerInputComponent } from '../player-input/player-input.component';

@Component({
  selector: 'app-player-list',
  imports: [AsyncPipe, PlayerInputComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class PlayerListComponent implements OnInit {
  playerService = inject(PlayerService);

  players$: Observable<Player[]> | undefined;
  player$: Observable<Player> | undefined;

  private getPlayers() {
    this.players$ = this.playerService.getPlayers();
  }

  getPlayer(id: number) {
    this.player$ = this.playerService.getPlayer(id);
  }

  deletePlayer(player: Player) {

  }

  ngOnInit(): void {
    this.getPlayers();
  }
}
