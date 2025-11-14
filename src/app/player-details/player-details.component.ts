import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../services/player.service';
import { Player } from '../interfaces/player';

@Component({
  selector: 'app-player-details',
  imports: [],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.css'
})
export class PlayerDetailsComponent implements OnInit {
  // inject dependencies
  private activatedRoute = inject(ActivatedRoute);
  private playerService = inject(PlayerService);

  // variables
  player: Player | null = null;

  // lifecycle hooks
  ngOnInit(): void {
    // check if the parameter id exists
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.playerService.getPlayer(Number(id)).subscribe(player => {
        this.player = player;
      })
    });
  }
}
