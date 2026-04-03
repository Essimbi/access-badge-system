import { Routes } from '@angular/router';

export const ACCESS_CONTROL_ROUTES: Routes = [
  {
    path: '',
    data: { roles: ['super_admin', 'admin'] },
    loadComponent: () => import('./gate-list/gate-list.component').then(m => m.GateListComponent)
  },
  {
    path: 'scanner',
    data: { roles: ['controller', 'admin', 'super_admin'] },
    loadComponent: () => import('./controller-dashboard/controller-dashboard.component').then(m => m.ControllerDashboardComponent)
  },
  {
    path: 'logs',
    data: { roles: ['controller', 'admin', 'super_admin'] },
    loadComponent: () => import('./access-logs/access-logs.component').then(m => m.AccessLogsComponent)
  },
  {
    path: 'monitor',
    data: { roles: ['admin', 'super_admin'] },
    loadComponent: () => import('./realtime-monitor/realtime-monitor.component').then(m => m.RealtimeMonitorComponent)
  }
];
