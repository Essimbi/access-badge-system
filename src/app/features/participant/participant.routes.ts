import { Routes } from '@angular/router';

export const PARTICIPANT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./participant-dashboard/participant-dashboard.component').then(m => m.ParticipantDashboardComponent)
  },
  {
    path: 'browse-events',
    loadComponent: () => import('./browse-events/browse-events.component').then(m => m.BrowseEventsComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  }
];
