import { Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { StandingsComponent } from './standings/standings.component';

export const routes: Routes = [
    {
      path:'',
      redirectTo: 'standings',
      pathMatch: 'full'
    },
    {
      path: 'events',
      component: EventListComponent
    },
    {
      path: 'players',
      component: PlayerListComponent
    },
    {
      path: 'standings',
      component: StandingsComponent
    }
];
