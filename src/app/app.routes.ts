import { Routes } from '@angular/router';
import { StandingsComponent } from './features/standings/standings/standings.component';
import { PlayerInputComponent } from './features/players/player-input/player-input.component';
import { PlayerListComponent } from './features/players/player-list/player-list.component';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { EventInputComponent } from './features/events/event-input/event-input.component';
import { PlayerDetailsComponent } from './features/players/player-details/player-details.component';
import { LoginComponent } from './core/auth/login/login.component';
import { authGuard } from './core/auth/auth.guard';
import { appSettings } from './app.settings';
import { PlayerDetailsResolver } from './features/players/player-details/player-details.resolver';
import { FeedbackComponent } from './features/static/feedback/feedback.component';
import { FaqComponent } from './features/static/faq/faq.component';
import { EventListPublicComponent } from './features/events/event-list-public/event-list-public.component';

export const routes: Routes = [
  {
    path: '',
    component: EventListPublicComponent
  },
  {
    path: 'event-list/:year',
    component: EventListPublicComponent
  },
  {
    path: 'events',
    component: EventListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'events/:year',
    component: EventListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'event/input',
    component: EventInputComponent,
    canActivate: [authGuard]
  },
  {
    path: 'event/input/:id',
    component: EventInputComponent,
    canActivate: [authGuard]
  },
  {
    path: 'players',
    component: PlayerListComponent
  },
  {
    path: 'player/input',
    component: PlayerInputComponent,
    canActivate: [authGuard]
  },
  {
    path: 'player/input/:id',
    component: PlayerInputComponent,
    canActivate: [authGuard]
  },
  {
    path: 'player/:id',
    component: PlayerDetailsComponent,
    resolve: {
      data: PlayerDetailsResolver
    }
  },
  {
    path: 'standings/:year/:category',
    component: StandingsComponent
  },
  {
    path: 'admin/login',
    component: LoginComponent
  },
  {
    path: 'feedback',
    component: FeedbackComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: '**',
    redirectTo: 'standings/' + appSettings.currentYear,
    pathMatch: 'full'
  }
];
