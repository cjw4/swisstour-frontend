import { Component, inject, OnInit } from '@angular/core';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-player-list',
  imports: [],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
  providers: [
    { provide: APP_SETTINGS, useValue: appSettings }
  ]
})
export class PlayerListComponent implements OnInit {
  http = inject(HttpClient);
  settings = inject(APP_SETTINGS);
  playersUrl = this.settings.apiUrl + '/players';
  players: any;

  private getPlayers() {
    this.http.get(this.playersUrl).subscribe(
      (result) => {
        console.log(result);
        this.players = result;
      },
      (error) => {
        console.error('Error fetching players:', error);
      }
    );
  }

  ngOnInit(): void {
    this.getPlayers();
  }

}
