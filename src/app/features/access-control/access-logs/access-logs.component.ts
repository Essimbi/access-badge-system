import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

interface AccessLog {
  id: number;
  participantName: string;
  participantId: number;
  eventName: string;
  eventId: number;
  badgeCategory: string;
  accessType: 'entry' | 'exit';
  timestamp: Date;
  gateId: number;
  gateName: string;
  status: 'success' | 'error';
  errorMessage?: string;
}

@Component({
  selector: 'app-access-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './access-logs.component.html',
  styleUrl: './access-logs.component.scss'
})
export class AccessLogsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  accessLogs: AccessLog[] = [];
  dataSource = new MatTableDataSource<AccessLog>([]);
  displayedColumns: string[] = ['timestamp', 'participantName', 'eventName', 'badgeCategory', 'accessType', 'gateName', 'status', 'actions'];
  loading = false;

  // Filters
  searchQuery = '';
  selectedAccessType: string = '';
  selectedStatus: string = '';
  selectedEvent: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  events: any[] = [];
  accessTypes = [
    { value: 'entry', label: 'Entrée' },
    { value: 'exit', label: 'Sortie' }
  ];
  statuses = [
    { value: 'success', label: 'Succès' },
    { value: 'error', label: 'Erreur' }
  ];

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAccessLogs();
    this.loadEvents();
  }

  loadAccessLogs(): void {
    this.loading = true;
    this.apiService.getAccessLogs().subscribe({
      next: (logs) => {
        this.accessLogs = logs.map((log: any) => ({
          id: log.id,
          participantName: `${log.firstName} ${log.lastName}`,
          participantId: log.userId,
          eventName: log.eventName,
          eventId: log.eventId,
          badgeCategory: log.badgeCategory,
          accessType: log.accessType,
          timestamp: new Date(log.timestamp),
          gateId: log.gateId,
          gateName: log.gateName,
          status: log.status || 'success',
          errorMessage: log.errorMessage
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.accessLogs = this.generateMockLogs();
        this.applyFilters();
        this.loading = false;
      }
    });
  }

  loadEvents(): void {
    this.apiService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      error: () => {
        this.events = [];
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.accessLogs];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.participantName.toLowerCase().includes(query) ||
        log.eventName.toLowerCase().includes(query) ||
        log.gateName.toLowerCase().includes(query)
      );
    }

    // Access type filter
    if (this.selectedAccessType) {
      filtered = filtered.filter(log => log.accessType === this.selectedAccessType);
    }

    // Status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(log => log.status === this.selectedStatus);
    }

    // Event filter
    if (this.selectedEvent) {
      filtered = filtered.filter(log => log.eventName === this.selectedEvent);
    }

    // Date range filter
    if (this.startDate) {
      filtered = filtered.filter(log => log.timestamp >= this.startDate!);
    }
    if (this.endDate) {
      const endOfDay = new Date(this.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(log => log.timestamp <= endOfDay);
    }

    this.dataSource.data = filtered;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedAccessType = '';
    this.selectedStatus = '';
    this.selectedEvent = '';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  exportLogs(): void {
    const csv = this.convertToCSV(this.dataSource.data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `access-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.notificationService.success('Logs exportés en CSV');
  }

  private convertToCSV(data: AccessLog[]): string {
    const headers = ['Heure', 'Participant', 'Événement', 'Catégorie', 'Type', 'Portail', 'Statut'];
    const rows = data.map(log => [
      log.timestamp.toLocaleString('fr-FR'),
      log.participantName,
      log.eventName,
      log.badgeCategory,
      log.accessType === 'entry' ? 'Entrée' : 'Sortie',
      log.gateName,
      log.status === 'success' ? 'Succès' : 'Erreur'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  getStatusIcon(status: string): string {
    return status === 'success' ? 'check_circle' : 'error';
  }

  getStatusColor(status: string): string {
    return status === 'success' ? 'primary' : 'warn';
  }

  getAccessTypeIcon(type: string): string {
    return type === 'entry' ? 'login' : 'logout';
  }

  getAccessTypeColor(type: string): string {
    return type === 'entry' ? 'success' : 'warning';
  }

  viewDetails(log: AccessLog): void {
    // Afficher les détails du log
    console.log('Détails du log:', log);
  }

  generateMockLogs(): AccessLog[] {
    const mockNames = [
      { first: 'Jean', last: 'Dupont' },
      { first: 'Marie', last: 'Martin' },
      { first: 'Pierre', last: 'Bernard' },
      { first: 'Sophie', last: 'Leclerc' },
      { first: 'Luc', last: 'Moreau' },
      { first: 'Anne', last: 'Petit' },
      { first: 'Marc', last: 'Durand' },
      { first: 'Isabelle', last: 'Lefevre' }
    ];

    const mockEvents = ['Conférence Innovation 2026', 'Workshop Angular 18', 'Sommet Tech Africa'];
    const mockCategories = ['VIP', 'Exposant', 'Visiteur'];
    const mockGates = ['GATE-001', 'GATE-002', 'MOBILE-045'];

    const logs: AccessLog[] = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const name = mockNames[Math.floor(Math.random() * mockNames.length)];
      const timestamp = new Date(now.getTime() - Math.random() * 86400000);

      logs.push({
        id: i + 1,
        participantName: `${name.first} ${name.last}`,
        participantId: Math.floor(Math.random() * 100) + 1,
        eventName: mockEvents[Math.floor(Math.random() * mockEvents.length)],
        eventId: Math.floor(Math.random() * 10) + 1,
        badgeCategory: mockCategories[Math.floor(Math.random() * mockCategories.length)],
        accessType: Math.random() > 0.5 ? 'entry' : 'exit',
        timestamp,
        gateId: Math.floor(Math.random() * 3) + 1,
        gateName: mockGates[Math.floor(Math.random() * mockGates.length)],
        status: Math.random() > 0.05 ? 'success' : 'error',
        errorMessage: Math.random() > 0.95 ? 'Badge expiré' : undefined
      });
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}
