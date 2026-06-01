import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, User } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule, 
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isDarkMode = false;
  isFullscreen = false;
  isUserOnline = true;
  notificationCount = 3; // Exemple de notifications

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements d'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // S'abonner aux changements de thème
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Vérifier l'état du plein écran au démarrage
    this.checkFullscreenStatus();
  }

  /**
   * Écoute les changements de plein écran
   */
  @HostListener('document:fullscreenchange', [])
  onFullscreenChange(): void {
    this.checkFullscreenStatus();
  }

  /**
   * Vérifie l'état actuel du plein écran
   */
  private checkFullscreenStatus(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Bascule entre mode clair et sombre
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Bascule le mode plein écran
   */
  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Erreur lors de l'activation du plein écran: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.log(`Erreur lors de la sortie du plein écran: ${err.message}`);
      });
    }
  }

  /**
   * Obtient les initiales de l'utilisateur pour l'avatar
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
      'super_admin': 'Super Administrateur',
      'admin': 'Administrateur',
      'controller': 'Contrôleur',
      'participant': 'Participant'
    };
    
    return roleLabels[role] || role;
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  /**
   * Vérifie si l'utilisateur a l'un des rôles spécifiés
   */
  hasAnyRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  /**
   * Ouvre la démonstration de la charte graphique
   */
  openThemeDemo(): void {
    // Naviguer vers la page de démonstration du thème
    // Ou ouvrir un dialog avec la démonstration
    import('../../../features/system/theme-demo/theme-demo.component').then(({ ThemeDemoComponent }) => {
      this.dialog.open(ThemeDemoComponent, {
        width: '90vw',
        maxWidth: '1200px',
        height: '90vh',
        panelClass: 'theme-demo-dialog'
      });
    });
  }
}
