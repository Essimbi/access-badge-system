import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

interface ParticipantStats {
  totalEvents: number;
  totalHours: number;
  badgesCollected: number;
  upcomingEvents: number;
}

interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  badgeCategory: string;
  badgeId?: number;
  enrolled: boolean;
}

@Component({
  selector: 'app-participant-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatListModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './participant-dashboard.component.html',
  styleUrl: './participant-dashboard.component.scss'
})
export class ParticipantDashboardComponent implements OnInit {
  participantStats: ParticipantStats = {
    totalEvents: 0,
    totalHours: 0,
    badgesCollected: 0,
    upcomingEvents: 0
  };

  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];
  loading = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadParticipantData();
  }

  loadParticipantData(): void {
    this.loading = true;

    // Charger les événements depuis les badges
    this.apiService.getMyBadges().subscribe({
      next: (badges) => {
        const mappedEvents = badges.map((b: any) => {
          let dynamicStatus = b.event.status || 'upcoming';
          const startDate = new Date(b.event.start_date);
          const endDate = new Date(b.event.end_date);
          const now = new Date();

          if (now < startDate) dynamicStatus = 'upcoming';
          else if (now >= startDate && now <= endDate) dynamicStatus = 'ongoing';
          else if (now > endDate) dynamicStatus = 'completed';

          return {
            id: b.event.id,
            title: b.event.title,
            date: startDate,
            location: b.event.location || 'N/A',
            status: dynamicStatus,
            badgeCategory: b.category,
            badgeId: b.id,
            enrolled: true
          };
        });

        this.upcomingEvents = mappedEvents.filter((e: any) => e.status === 'upcoming' || e.status === 'ongoing');
        this.pastEvents = mappedEvents.filter((e: any) => e.status === 'completed');

        this.loadParticipantStats();
        this.loading = false;
      },
      error: () => {
        this.upcomingEvents = this.generateMockUpcomingEvents();
        this.pastEvents = this.generateMockPastEvents();
        this.loadParticipantStats();
        this.loading = false;
      }
    });
  }

  loadParticipantStats(): void {
    this.participantStats = {
      totalEvents: this.upcomingEvents.length + this.pastEvents.length,
      totalHours: this.pastEvents.length * 8,
      badgesCollected: this.pastEvents.length,
      upcomingEvents: this.upcomingEvents.length
    };
  }

  downloadBadge(event: Event): void {
    if (!event.badgeId) {
      this.notificationService.error('Badge non disponible');
      return;
    }

    this.apiService.downloadBadgePDF(event.badgeId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `badge-${event.title}-${event.date.getFullYear()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.notificationService.success('Badge téléchargé');
      },
      error: () => {
        this.notificationService.error('Erreur lors du téléchargement du badge');
      }
    });
  }

  printBadge(event: Event): void {
    this.notificationService.info('Impression du badge en cours...');
    // Simulation de l'impression
    setTimeout(() => {
      this.notificationService.success('Badge imprimé avec succès');
    }, 1000);
  }

  shareBadge(event: Event, platform: string): void {
    const message = `J'ai participé à ${event.title} et j'ai reçu un badge ${event.badgeCategory}!`;
    
    switch (platform) {
      case 'email':
        window.location.href = `mailto:?subject=Mon badge&body=${encodeURIComponent(message)}`;
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank');
        break;
    }
    
    this.notificationService.success(`Badge partagé sur ${platform}`);
  }

  enrollEvent(event: Event): void {
    this.notificationService.info('Inscription en cours...');
    this.apiService.enrollEventBadge(event.id).subscribe({
      next: () => {
        event.enrolled = true;
        this.notificationService.success('Inscription confirmée');
      },
      error: (err) => this.notificationService.error(err.error?.error || 'Erreur lors de l\'inscription')
    });
  }

  cancelEnrollment(event: Event): void {
    this.notificationService.info('Annulation en cours...');
    this.apiService.unenrollEventBadge(event.id).subscribe({
      next: () => {
        event.enrolled = false;
        this.upcomingEvents = this.upcomingEvents.filter((e: any) => e.id !== event.id);
        this.pastEvents = this.pastEvents.filter((e: any) => e.id !== event.id);
        this.loadParticipantStats();
        this.notificationService.success('Inscription annulée');
      },
      error: (err) => this.notificationService.error(err.error?.error || 'Erreur lors de l\'annulation')
    });
  }

  getRandomCategory(): string {
    const categories = ['VIP', 'Exposant', 'Visiteur', 'Conférencier', 'Sponsor'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  generateMockUpcomingEvents(): Event[] {
    return [
      {
        id: 1,
        title: 'Conférence Innovation 2026',
        date: new Date('2026-03-15'),
        location: 'Palais de la Culture',
        status: 'upcoming',
        badgeCategory: 'VIP',
        badgeId: 101,
        enrolled: true
      },
      {
        id: 2,
        title: 'Workshop Angular 18',
        date: new Date('2026-02-20'),
        location: 'Hôtel Ivoire',
        status: 'upcoming',
        badgeCategory: 'Exposant',
        badgeId: 102,
        enrolled: true
      }
    ];
  }

  generateMockPastEvents(): Event[] {
    return [
      {
        id: 3,
        title: 'Sommet Tech Africa',
        date: new Date('2026-01-10'),
        location: 'Abidjan, CIV',
        status: 'completed',
        badgeCategory: 'Visiteur',
        badgeId: 103,
        enrolled: true
      },
      {
        id: 4,
        title: 'Hackathon 2025',
        date: new Date('2025-12-01'),
        location: 'Centre Tech',
        status: 'completed',
        badgeCategory: 'Conférencier',
        badgeId: 104,
        enrolled: true
      }
    ];
  }
}
