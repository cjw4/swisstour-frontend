import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../services/player.service';
import { Player } from '../interfaces/player';
import { DivisionStats } from '../interfaces/division-stats';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-player-details',
  imports: [AsyncPipe],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.css',
})
export class PlayerDetailsComponent implements OnInit {
  // inject dependencies
  private activatedRoute = inject(ActivatedRoute);
  private playerService = inject(PlayerService);

  // variables
  player$: Observable<Player> | undefined;
  playerStats: DivisionStats | undefined;
  divisions: string[] | undefined;

  // lifecycle hooks
  ngOnInit(): void {
    // get the player id
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      const numId = Number(id);
      this.player$ = this.playerService.getPlayer(numId);
      this.playerService.getPlayerStats(numId).subscribe((result) => {
        this.playerStats = result;
        this.divisions = Object.keys(result);
      });
    }
  }
}
