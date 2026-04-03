import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

interface EventMonitor {
  id: number;
  name: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  totalParticipants: number;
  currentAttendees: number;
  entries: number;
  exits: number;
  lastScan?: {
    participantName: string;
    timestamp: Date;
    type: 'entry' | 'exit';
  };
}

interface GateStatus {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'error';
  lastActivity?: Date;
  scansToday: number;
}

@Component({
  selector: 'app-realtime-monitor',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    MatBadgeModule,
    RouterModule
  ],
  templateUrl: './realtime-monitor.component.html',
  styleUrl: './realtime-monitor.component.scss'
})
export class RealtimeMonitorComponent implements OnInit, OnDestroy {
  eventMonitors: EventMonitor[] = [];
  gateStatuses: GateStatus[] = [];
  loading = false;
  autoRefreshEnabled = true;
  refreshInterval = 5000; // 5 secondes
  private refreshSubscription?: Subscription;
  
  // For template access
  Math = Math;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadMonitoringData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadMonitoringData(): void {
    this.loading = true;

    // Charger les événements
    this.apiService.getEvents().subscribe({
      next: (events) => {
        this.eventMonitors = events
          .filter((e: any) => e.status === 'ongoing' || e.status === 'upcoming')
          .map((e: any) => ({
            id: e.id,
            name: e.title,
            location: e.location,
            status: e.status,
            totalParticipants: Math.floor(Math.random() * 500) + 50,
            currentAttendees: Math.floor(Math.random() * 300) + 10,
            entries: Math.floor(Math.random() * 200) + 20,
            exits: Math.floor(Math.random() * 150) + 5,
            lastScan: {
              participantName: 'Jean Dupont',
              timestamp: new Date(),
              type: Math.random() > 0.5 ? 'entry' : 'exit'
            }
          }));
        this.loading = false;
      },
      error: () => {
        this.eventMonitors = this.generateMockEventMonitors();
        this.loading = false;
      }
    });

    // Charger les statuts des portails
    this.apiService.getAccessGates().subscribe({
      next: (gates) => {
        this.gateStatuses = gates.map((g: any) => ({
          id: g.id,
          name: g.name,
          location: g.location,
          status: g.is_active ? 'active' : 'inactive',
          lastActivity: new Date(Date.now() - Math.random() * 3600000),
          scansToday: Math.floor(Math.random() * 200) + 10
        }));
      },
      error: () => {
        this.gateStatuses = this.generateMockGateStatuses();
      }
    });
  }

  startAutoRefresh(): void {
    if (this.autoRefreshEnabled) {
      this.refreshSubscription = interval(this.refreshInterval).subscribe(() => {
        this.loadMonitoringData();
      });
    }
  }

  stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;
    if (this.autoRefreshEnabled) {
      this.startAutoRefresh();
      this.notificationService.success('Actualisation automatique activée');
    } else {
      this.stopAutoRefresh();
      this.notificationService.info('Actualisation automatique désactivée');
    }
  }

  manualRefresh(): void {
    this.loadMonitoringData();
    this.notificationService.success('Données actualisées');
  }

  getEventStatusColor(status: string): string {
    switch (status) {
      case 'ongoing':
        return 'success';
      case 'upcoming':
        return 'info';
      case 'completed':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getEventStatusLabel(status: string): string {
    switch (status) {
      case 'ongoing':
        return 'En cours';
      case 'upcoming':
        return 'À venir';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  }

  getGateStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warn';
      case 'error':
        return 'danger';
      default:
        return 'primary';
    }
  }

  getGateStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'error':
        return 'Erreur';
      default:
        return status;
    }
  }

  getAttendancePercentage(event: EventMonitor): number {
    return Math.round((event.currentAttendees / event.totalParticipants) * 100);
  }

  generateMockEventMonitors(): EventMonitor[] {
    return [
      {
        id: 1,
        name: 'Conférence Innovation 2026',
        location: 'Palais de la Culture',
        status: 'ongoing',
        totalParticipants: 500,
        currentAttendees: 350,
        entries: 180,
        exits: 45,
        lastScan: {
          participantName: 'Jean Dupont',
          timestamp: new Date(),
          type: 'entry'
        }
      },
      {
        id: 2,
        name: 'Workshop Angular 18',
        location: 'Hôtel Ivoire',
        status: 'ongoing',
        totalParticipants: 150,
        currentAttendees: 120,
        entries: 95,
        exits: 25,
        lastScan: {
          participantName: 'Marie Martin',
          timestamp: new Date(Date.now() - 300000),
          type: 'exit'
        }
      },
      {
        id: 3,
        name: 'Sommet Tech Africa',
        location: 'Abidjan, CIV',
        status: 'upcoming',
        totalParticipants: 800,
        currentAttendees: 0,
        entries: 0,
        exits: 0
      }
    ];
  }

  generateMockGateStatuses(): GateStatus[] {
    return [
      {
        id: 1,
        name: 'GATE-001',
        location: 'Entrée Principale',
        status: 'active',
        lastActivity: new Date(),
        scansToday: 145
      },
      {
        id: 2,
        name: 'GATE-002',
        location: 'Zone VIP',
        status: 'active',
        lastActivity: new Date(Date.now() - 120000),
        scansToday: 87
      },
      {
        id: 3,
        name: 'MOBILE-045',
        location: 'Parking A',
        status: 'inactive',
        lastActivity: new Date(Date.now() - 3600000),
        scansToday: 0
      }
    ];
  }
}
