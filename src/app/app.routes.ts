import { Routes } from '@angular/router';
import { EventPageComponent } from './event-page/event-page.component';
import { StandingsComponent } from './standings/standings.component';
import { PlayerInputComponent } from './player-input/player-input.component';
import { PlayerListComponent } from './player-list/player-list.component';

export const routes: Routes = [
    {
      path:'',
      redirectTo: 'standings',
      pathMatch: 'full'
    },
    {
      path: 'events',
      component: EventPageComponent
    },
    {
      path: 'players',
      component: PlayerListComponent
    },
    {
      path: 'player/input',
      component: PlayerInputComponent
    },
    {
    path: 'player/input/:id',
    component: PlayerInputComponent
    },
    {
      path: 'standings',
      component: StandingsComponent
    }
];
