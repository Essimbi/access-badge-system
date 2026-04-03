import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;

  navItems: NavItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard' },
    { label: 'Mon Espace', icon: 'home', route: '/dashboard/participant', roles: ['participant'] },
    { label: 'Parcourir les Événements', icon: 'event', route: '/dashboard/participant/browse-events', roles: ['participant'] },
    { label: 'Mon Profil', icon: 'person', route: '/dashboard/participant/profile', roles: ['participant'] },
    { label: 'Organisations', icon: 'business', route: '/dashboard/organizations', roles: ['super_admin'] },
    { label: 'Mon Organisation', icon: 'corporate_fare', route: '/dashboard/organizations/my', roles: ['admin'] },
    { label: 'Événements', icon: 'event', route: '/dashboard/events', roles: ['super_admin', 'admin'] },
    { label: 'Inscriptions', icon: 'assignment', route: '/dashboard/enrollments', roles: ['super_admin', 'admin'] },
    { label: 'Badges', icon: 'badge', route: '/dashboard/badges', roles: ['super_admin', 'admin'] },
    { label: 'Scanner QR', icon: 'qr_code_scanner', route: '/dashboard/access-control/scanner', roles: ['controller', 'admin', 'super_admin'] },
    { label: 'Logs d\'accès', icon: 'history', route: '/dashboard/access-control/logs', roles: ['controller', 'admin', 'super_admin'] },
    { label: 'Monitoring', icon: 'monitor', route: '/dashboard/access-control/monitor', roles: ['admin', 'super_admin'] },
    { label: 'Portails', icon: 'qr_code_scanner', route: '/dashboard/access-control', roles: ['super_admin', 'admin'] },
    { label: 'Utilisateurs', icon: 'people', route: '/dashboard/users', roles: ['super_admin', 'admin'] },
    { label: 'Statistiques', icon: 'bar_chart', route: '/dashboard/statistics', roles: ['super_admin', 'admin'] },
    { label: 'Journaux d\'audit', icon: 'history_edu', route: '/dashboard/system/audit-logs', roles: ['super_admin'] },
    { label: 'Paramètres système', icon: 'settings', route: '/dashboard/system/settings', roles: ['super_admin'] },
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  canShow(item: NavItem): boolean {
    if (!item.roles) return true;
    return this.authService.hasAnyRole(item.roles);
  }
}
