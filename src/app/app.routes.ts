import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/dashboard/dashboard-home/dashboard-home').then(m => m.DashboardHomeComponent)
            },
            {
                path: 'organizations',
                data: { roles: ['super_admin'] },
                children: [
                    {
                        path: '',
                        data: { roles: ['super_admin'] },
                        loadComponent: () => import('./features/organizations/organization-list/organization-list.component').then(m => m.OrganizationListComponent)
                    },
                    {
                        path: 'my',
                        data: { roles: ['admin'] },
                        loadComponent: () => import('./features/organizations/organization-detail/organization-detail.component').then(m => m.OrganizationDetailComponent)
                    },
                    {
                        path: ':id',
                        data: { roles: ['super_admin'] },
                        loadComponent: () => import('./features/organizations/organization-detail/organization-detail.component').then(m => m.OrganizationDetailComponent)
                    }
                ]
            },
            {
                path: 'users',
                data: { roles: ['super_admin', 'admin'] },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent)
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./features/users/user-detail/user-detail.component').then(m => m.UserDetailComponent)
                    }
                ]
            },
            {
                path: 'events',
                data: { roles: ['super_admin', 'admin'] },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/events/event-list/event-list.component').then(m => m.EventListComponent)
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./features/events/event-detail/event-detail.component').then(m => m.EventDetailComponent)
                    }
                ]
            },
            {
                path: 'enrollments',
                data: { roles: ['super_admin', 'admin'] },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/enrollments/enrollment-list/enrollment-list.component').then(m => m.EnrollmentListComponent)
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./features/enrollments/enrollment-detail/enrollment-detail.component').then(m => m.EnrollmentDetailComponent)
                    }
                ]
            },
            {
                path: 'badges',
                data: { roles: ['super_admin', 'admin'] },
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/badges/badge-list/badge-list.component').then(m => m.BadgeListComponent)
                    },
                    {
                        path: 'new',
                        loadComponent: () => import('./features/badges/badge-designer/badge-designer.component').then(m => m.BadgeDesignerComponent)
                    },
                    {
                        path: 'edit/:id',
                        loadComponent: () => import('./features/badges/badge-designer/badge-designer.component').then(m => m.BadgeDesignerComponent)
                    }
                ]
            },
            {
                path: 'access-control',
                data: { roles: ['super_admin', 'admin'] },
                loadComponent: () => import('./features/access-control/gate-list/gate-list.component').then(m => m.GateListComponent)
            },
            {
                path: 'statistics',
                data: { roles: ['super_admin'] },
                loadComponent: () => import('./features/statistics/dashboard/dashboard.component').then(m => m.StatisticsDashboardComponent)
            },
            {
                path: 'system',
                data: { roles: ['super_admin'] },
                children: [
                    {
                        path: 'audit-logs',
                        loadComponent: () => import('./features/system/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent)
                    },
                    {
                        path: 'settings',
                        loadComponent: () => import('./features/system/settings/settings.component').then(m => m.SettingsComponent)
                    }
                ]
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
