import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  type: string;
  organization: string;
  enrolled: boolean;
  participants: number;
  maxParticipants: number;
}

@Component({
  selector: 'app-browse-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './browse-events.component.html',
  styleUrl: './browse-events.component.scss'
})
export class BrowseEventsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = false;

  // Filters
  searchQuery = '';
  selectedType = '';
  selectedStatus = 'upcoming';
  selectedOrganization = '';

  eventTypes = ['Conference', 'Workshop', 'Summit', 'Hackathon', 'Meetup'];
  organizations: string[] = [];
  statuses = [
    { value: 'upcoming', label: 'À venir' },
    { value: 'ongoing', label: 'En cours' },
    { value: 'completed', label: 'Terminé' }
  ];

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.apiService.getEvents().subscribe({
      next: (events) => {
        this.apiService.getMyBadges().subscribe({
          next: (badges) => {
            const enrolledEventIds = badges.map((b: any) => b.event_id);
            this.events = events.map((e: any) => ({
              id: e.id,
              title: e.title,
              description: e.description || 'Description non disponible',
              date: new Date(e.date),
              location: e.location,
              status: e.status,
              type: e.type || 'Conference',
              organization: e.organization || 'Organisation Inconnue',
              enrolled: enrolledEventIds.includes(e.id),
              participants: parseInt(e.participantCount, 10) || 0,
              maxParticipants: parseInt(e.maxParticipants, 10) || 500
            }));

            this.organizations = [...new Set(this.events.map(e => e.organization))];
            this.applyFilters();
            this.loading = false;
          },
          error: () => this.handleError()
        });
      },
      error: () => this.handleError()
    });
  }

  private handleError(): void {
    this.events = this.generateMockEvents();
    this.organizations = [...new Set(this.events.map(e => e.organization))];
    this.applyFilters();
    this.loading = false;
  }

  applyFilters(): void {
    let filtered = [...this.events];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query) ||
        e.organization.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (this.selectedType) {
      filtered = filtered.filter(e => e.type === this.selectedType);
    }

    // Status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(e => e.status === this.selectedStatus);
    }

    // Organization filter
    if (this.selectedOrganization) {
      filtered = filtered.filter(e => e.organization === this.selectedOrganization);
    }

    this.filteredEvents = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedStatus = 'upcoming';
    this.selectedOrganization = '';
    this.applyFilters();
  }

  enrollEvent(event: Event): void {
    if (event.participants >= event.maxParticipants) {
      this.notificationService.error('Événement complet');
      return;
    }

    this.notificationService.info('Inscription en cours...');
    this.apiService.enrollEventBadge(event.id).subscribe({
      next: () => {
        event.enrolled = true;
        event.participants++;
        this.notificationService.success('Inscription confirmée');
      },
      error: (err) => {
        this.notificationService.error(err.error?.error || 'Erreur lors de l\'inscription');
      }
    });
  }

  cancelEnrollment(event: Event): void {
    this.notificationService.info('Annulation en cours...');
    this.apiService.unenrollEventBadge(event.id).subscribe({
      next: () => {
        event.enrolled = false;
        event.participants--;
        this.notificationService.success('Inscription annulée');
      },
      error: (err) => {
        this.notificationService.error(err.error?.error || 'Erreur lors de l\'annulation');
      }
    });
  }

  getAvailableSpots(event: Event): number {
    return event.maxParticipants - event.participants;
  }

  getOccupancyPercentage(event: Event): number {
    return Math.round((event.participants / event.maxParticipants) * 100);
  }

  generateMockEvents(): Event[] {
    const mockEvents = [
      {
        id: 1,
        title: 'Conférence Innovation 2026',
        description: 'Un événement musical unique au cœur de la ville.',
        date: new Date('2026-03-15'),
        location: 'Palais de la Culture',
        status: 'upcoming' as const,
        type: 'Conference',
        organization: '3CM Event Solutions',
        enrolled: false,
        participants: 150,
        maxParticipants: 500
      },
      {
        id: 2,
        title: 'Workshop Angular 18',
        description: 'Apprenez les dernières techniques Angular.',
        date: new Date('2026-02-20'),
        location: 'Hôtel Ivoire',
        status: 'upcoming' as const,
        type: 'Workshop',
        organization: '3CM Event Solutions',
        enrolled: false,
        participants: 45,
        maxParticipants: 100
      },
      {
        id: 3,
        title: 'Sommet Tech Africa',
        description: 'Le rendez-vous des leaders technologiques.',
        date: new Date('2026-01-10'),
        location: 'Abidjan, CIV',
        status: 'completed' as const,
        type: 'Summit',
        organization: 'Global Tech Expo',
        enrolled: false,
        participants: 300,
        maxParticipants: 500
      },
      {
        id: 4,
        title: 'Hackathon 2026',
        description: 'Créez des solutions innovantes en 48 heures.',
        date: new Date('2026-04-01'),
        location: 'Centre Tech',
        status: 'upcoming' as const,
        type: 'Hackathon',
        organization: '3CM Event Solutions',
        enrolled: false,
        participants: 80,
        maxParticipants: 150
      },
      {
        id: 5,
        title: 'Meetup Développeurs',
        description: 'Rencontrez d\'autres développeurs passionnés.',
        date: new Date('2026-02-28'),
        location: 'Café Tech',
        status: 'upcoming' as const,
        type: 'Meetup',
        organization: 'Global Tech Expo',
        enrolled: false,
        participants: 25,
        maxParticipants: 50
      }
    ];

    return mockEvents;
  }
}
