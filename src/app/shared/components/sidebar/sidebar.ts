import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, User } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  badge?: number;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatListModule, 
    MatIconModule, 
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  animations: [
    trigger('sidebarAnimation', [
      state('expanded', style({
        width: '16rem'
      })),
      state('collapsed', style({
        width: '4rem'
      })),
      transition('expanded <=> collapsed', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ]),
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in')
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<boolean>();
  
  currentUser: User | null = null;
  currentRoute = '';
  private subscriptions: Subscription[] = [];

  navItems: NavItem[] = [
    { 
      label: 'Tableau de bord', 
      icon: 'dashboard', 
      route: '/dashboard',
      badge: 0
    },
    { 
      label: 'Mon Espace', 
      icon: 'home', 
      route: '/dashboard/participant', 
      roles: ['participant'] 
    },
    { 
      label: 'Événements', 
      icon: 'event', 
      route: '/dashboard/participant/browse-events', 
      roles: ['participant'],
      badge: 0
    },
    { 
      label: 'Mon Profil', 
      icon: 'person', 
      route: '/dashboard/participant/profile', 
      roles: ['participant'] 
    },
    { 
      label: 'Organisations', 
      icon: 'business', 
      route: '/dashboard/organizations', 
      roles: ['super_admin'] 
    },
    { 
      label: 'Mon Organisation', 
      icon: 'corporate_fare', 
      route: '/dashboard/organizations/my', 
      roles: ['admin'] 
    },
    { 
      label: 'Gestion Événements', 
      icon: 'event_note', 
      route: '/dashboard/events', 
      roles: ['super_admin', 'admin'] 
    },
    { 
      label: 'Inscriptions', 
      icon: 'assignment', 
      route: '/dashboard/enrollments', 
      roles: ['super_admin', 'admin'],
      badge: 0
    },
    { 
      label: 'Badges', 
      icon: 'badge', 
      route: '/dashboard/badges', 
      roles: ['super_admin', 'admin'] 
    },
    { 
      label: 'Scanner QR', 
      icon: 'qr_code_scanner', 
      route: '/dashboard/access-control/scanner', 
      roles: ['controller', 'admin', 'super_admin'] 
    },
    { 
      label: 'Logs d\'accès', 
      icon: 'history', 
      route: '/dashboard/access-control/logs', 
      roles: ['controller', 'admin', 'super_admin'] 
    },
    { 
      label: 'Monitoring', 
      icon: 'monitor_heart', 
      route: '/dashboard/access-control/monitor', 
      roles: ['admin', 'super_admin'] 
    },
    { 
      label: 'Portails', 
      icon: 'sensors', 
      route: '/dashboard/access-control', 
      roles: ['super_admin', 'admin'] 
    },
    { 
      label: 'Utilisateurs', 
      icon: 'people', 
      route: '/dashboard/users', 
      roles: ['super_admin', 'admin'] 
    },
    { 
      label: 'Statistiques', 
      icon: 'analytics', 
      route: '/dashboard/statistics', 
      roles: ['super_admin', 'admin'] 
    },
    { 
      label: 'Audit', 
      icon: 'history_edu', 
      route: '/dashboard/system/audit-logs', 
      roles: ['super_admin'] 
    },
    { 
      label: 'Paramètres', 
      icon: 'settings', 
      route: '/dashboard/system/settings', 
      roles: ['super_admin'] 
    },
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadDynamicBadges();
      }
    });

    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });

    // Initialiser la route actuelle
    this.currentRoute = this.router.url;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Charge les badges dynamiques depuis l'API
   */
  private loadDynamicBadges(): void {
    const sub = this.apiService.getEvents().subscribe({
      next: (events: any[]) => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Compter les événements créés dans les 7 derniers jours
        const newEventsCount = events.filter((event: any) => {
          const createdAt = new Date(event.createdAt || event.created_at);
          return createdAt >= sevenDaysAgo;
        }).length;

        // Mettre à jour le badge "Événements" (participant)
        const participantEventsItem = this.navItems.find(
          item => item.route === '/dashboard/participant/browse-events'
        );
        if (participantEventsItem) {
          participantEventsItem.badge = newEventsCount;
        }

        // Compter les événements à venir (upcoming) pour les admins
        const upcomingCount = events.filter((e: any) => e.status === 'upcoming').length;
        const gestionEventsItem = this.navItems.find(
          item => item.route === '/dashboard/events'
        );
        if (gestionEventsItem) {
          gestionEventsItem.badge = upcomingCount;
        }
      },
      error: () => {
        // En cas d'erreur, on laisse les badges à 0
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Vérifie si un élément de navigation peut être affiché
   */
  canShow(item: NavItem): boolean {
    if (!item.roles) return true;
    return this.authService.hasAnyRole(item.roles);
  }

  /**
   * Bascule l'état de la sidebar
   */
  onToggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidebar.emit(this.isCollapsed);
  }

  /**
   * Obtient les initiales de l'utilisateur
   */
  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  /**
   * Obtient le libellé du rôle utilisateur
   */
  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'super_admin': 'Super Admin',
      'admin': 'Administrateur',
      'controller': 'Contrôleur',
      'participant': 'Participant'
    };
    
    return roleLabels[role] || role;
  }

  /**
   * Filtre les éléments de navigation visibles
   */
  get visibleNavItems(): NavItem[] {
    return this.navItems.filter(item => this.canShow(item));
  }

  /**
   * TrackBy function pour optimiser le rendu de la liste
   */
  trackByRoute(index: number, item: NavItem): string {
    return item.route;
  }

  /**
   * Détermine si une route doit utiliser une correspondance exacte
   */
  shouldUseExactMatch(route: string): boolean {
    // Routes qui nécessitent une correspondance exacte
    const exactRoutes = [
      '/dashboard',
      '/dashboard/participant',
      '/dashboard/organizations',
      '/dashboard/events',
      '/dashboard/users',
      '/dashboard/statistics'
    ];
    
    return exactRoutes.includes(route);
  }

  /**
   * Vérifie si un élément de navigation est actif
   */
  isNavItemActive(item: NavItem): boolean {
    // Correspondance exacte pour certaines routes
    if (this.shouldUseExactMatch(item.route)) {
      return this.currentRoute === item.route;
    }
    
    // Pour les autres routes, trouver la route la plus longue qui correspond
    const matchingRoutes = this.visibleNavItems
      .filter(navItem => this.currentRoute.startsWith(navItem.route))
      .sort((a, b) => b.route.length - a.route.length); // Trier par longueur décroissante
    
    // Seule la route la plus longue (la plus spécifique) est active
    return matchingRoutes.length > 0 && matchingRoutes[0].route === item.route;
  }
}
