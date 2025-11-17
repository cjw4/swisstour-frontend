import { Routes } from '@angular/router';
import { StandingsComponent } from './standings/standings.component';
import { PlayerInputComponent } from './player-input/player-input.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventInputComponent } from './event-input/event-input.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { LoginComponent } from './login/login.component';

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
      path: 'event/input',
      component: EventInputComponent
    },
    {
      path: 'event/input/:id',
      component: EventInputComponent
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
    path: 'player/:id',
    component: PlayerDetailsComponent
    },
    {
      path: 'standings',
      component: StandingsComponent
    },
    {
      path: 'admin/login',
      component: LoginComponent
    }
];
