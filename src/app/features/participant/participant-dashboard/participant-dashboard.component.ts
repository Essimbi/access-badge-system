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
  description?: string;
  date: Date;
  start_date?: Date;
  end_date?: Date;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  badgeCategory: string;
  badgeId?: number;
  enrolled: boolean;
  capacity?: number;
  enrolled_count?: number;
  organizer?: string;
  duration?: string;
  event_type?: string;
}

interface CalendarDay {
  day: number;
  isPrevMonth: boolean;
  isNextMonth: boolean;
  isToday: boolean;
  hasEvent: boolean;
  date: Date;
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
  
  // Calendrier
  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  monthEvents: Event[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadParticipantData();
    this.generateCalendar();
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
            description: b.event.description || 'Aucune description disponible',
            date: startDate,
            start_date: startDate,
            end_date: endDate,
            location: b.event.location || 'Lieu à définir',
            status: dynamicStatus,
            badgeCategory: b.category,
            badgeId: b.id,
            enrolled: true,
            capacity: b.event.capacity || 0,
            enrolled_count: b.event.enrolled_count || 0,
            organizer: b.event.organizer || '3CM',
            duration: this.calculateDuration(startDate, endDate),
            event_type: b.event.event_type || 'Conférence'
          };
        });

        this.upcomingEvents = mappedEvents.filter((e: any) => e.status === 'upcoming' || e.status === 'ongoing');
        this.pastEvents = mappedEvents.filter((e: any) => e.status === 'completed');

        this.loadParticipantStats();
        this.updateMonthEvents();
        this.generateCalendar();
        this.loading = false;
      },
      error: () => {
        this.upcomingEvents = this.generateMockUpcomingEvents();
        this.pastEvents = this.generateMockPastEvents();
        this.loadParticipantStats();
        this.updateMonthEvents();
        this.generateCalendar();
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
        description: 'Une conférence sur les dernières innovations technologiques et les tendances du futur',
        date: new Date('2026-03-15'),
        start_date: new Date('2026-03-15T09:00:00'),
        end_date: new Date('2026-03-15T17:00:00'),
        location: 'Palais de la Culture, Abidjan',
        status: 'upcoming',
        badgeCategory: 'VIP',
        badgeId: 101,
        enrolled: true,
        capacity: 500,
        enrolled_count: 342,
        organizer: '3CM Events',
        duration: '8 heures',
        event_type: 'Conférence'
      },
      {
        id: 2,
        title: 'Workshop Angular 18',
        description: 'Atelier pratique sur les nouvelles fonctionnalités d\'Angular 18 et les meilleures pratiques',
        date: new Date('2026-02-20'),
        start_date: new Date('2026-02-20T14:00:00'),
        end_date: new Date('2026-02-20T18:00:00'),
        location: 'Hôtel Ivoire, Cocody',
        status: 'upcoming',
        badgeCategory: 'Participant',
        badgeId: 102,
        enrolled: true,
        capacity: 50,
        enrolled_count: 35,
        organizer: '3CM Tech',
        duration: '4 heures',
        event_type: 'Workshop'
      }
    ];
  }

  generateMockPastEvents(): Event[] {
    return [
      {
        id: 3,
        title: 'Sommet Tech Africa',
        description: 'Le plus grand sommet technologique d\'Afrique de l\'Ouest avec des experts internationaux',
        date: new Date('2026-01-10'),
        start_date: new Date('2026-01-10T08:00:00'),
        end_date: new Date('2026-01-12T18:00:00'),
        location: 'Abidjan, Côte d\'Ivoire',
        status: 'completed',
        badgeCategory: 'Visiteur',
        badgeId: 103,
        enrolled: true,
        capacity: 1000,
        enrolled_count: 856,
        organizer: 'Tech Africa',
        duration: '3 jours',
        event_type: 'Sommet'
      },
      {
        id: 4,
        title: 'Hackathon 2025',
        description: 'Compétition de développement de 48h pour créer des solutions innovantes',
        date: new Date('2025-12-01'),
        start_date: new Date('2025-12-01T18:00:00'),
        end_date: new Date('2025-12-03T18:00:00'),
        location: 'Centre Tech, Plateau',
        status: 'completed',
        badgeCategory: 'Participant',
        badgeId: 104,
        enrolled: true,
        capacity: 100,
        enrolled_count: 87,
        organizer: '3CM Innovation',
        duration: '48 heures',
        event_type: 'Hackathon'
      }
    ];
  }

  // ============================================================================
  // MÉTHODES DU CALENDRIER
  // ============================================================================

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Premier jour de la semaine (lundi = 1, dimanche = 0)
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - daysToSubtract);
    
    // Générer 42 jours (6 semaines)
    this.calendarDays = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      const isToday = this.isSameDay(currentDay, today);
      const hasEvent = this.hasEventOnDate(currentDay);
      
      this.calendarDays.push({
        day: currentDay.getDate(),
        isPrevMonth: currentDay.getMonth() < month,
        isNextMonth: currentDay.getMonth() > month,
        isToday: isToday,
        hasEvent: hasEvent,
        date: new Date(currentDay)
      });
    }
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
    this.updateMonthEvents();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
    this.updateMonthEvents();
  }

  updateMonthEvents(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const allEvents = [...this.upcomingEvents, ...this.pastEvents];
    
    this.monthEvents = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  }

  hasEventOnDate(date: Date): boolean {
    const allEvents = [...this.upcomingEvents, ...this.pastEvents];
    return allEvents.some(event => this.isSameDay(new Date(event.date), date));
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  calculateDuration(startDate: Date, endDate: Date): string {
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return diffDays === 1 ? '1 jour' : `${diffDays} jours`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? '1 heure' : `${diffHours} heures`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return diffMinutes === 1 ? '1 minute' : `${diffMinutes} minutes`;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminé';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'ongoing': return 'status-ongoing';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }
}
