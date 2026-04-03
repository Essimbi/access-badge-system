import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { RouterModule } from '@angular/router';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

interface ScanRecord {
  id: string;
  participantName: string;
  eventName: string;
  badgeCategory: string;
  timestamp: Date;
  accessType: 'entry' | 'exit';
  status: 'success' | 'error';
}

interface TodayStats {
  entries: number;
  exits: number;
  currentAttendees: number;
  totalScans: number;
}

@Component({
  selector: 'app-controller-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSnackBarModule,
    ZXingScannerModule,
    RouterModule
  ],
  templateUrl: './controller-dashboard.component.html',
  styleUrl: './controller-dashboard.component.scss'
})
export class ControllerDashboardComponent implements OnInit {
  @ViewChild('scanner') scanner: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  accessType: 'entry' | 'exit' = 'entry';
  lastScan: ScanRecord | null = null;
  recentScans: ScanRecord[] = [];
  todayStats: TodayStats = {
    entries: 0,
    exits: 0,
    currentAttendees: 0,
    totalScans: 0
  };

  assignedEvents: any[] = [];
  selectedEventId: number | null = null;

  scannerActive = true;
  loading = false;
  displayedColumns: string[] = ['timestamp', 'participantName', 'eventName', 'badgeCategory', 'accessType', 'status'];
  dataSource = new MatTableDataSource<ScanRecord>([]);
  
  // For template access
  Math = Math;
  qrFormats: any[] = ['QR_CODE'];

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAssignedEvents();
    this.loadRecentScans();
    this.loadTodayStats();
    this.generateMockStats();
  }

  loadAssignedEvents(): void {
    // Pour un contrôleur, charger les événements de son organisation
    this.apiService.getEvents().subscribe({
      next: (events) => {
        this.assignedEvents = events.filter((e: any) => 
          e.status === 'ongoing' || e.status === 'upcoming'
        );
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des événements');
      }
    });
  }

  loadRecentScans(): void {
    this.apiService.getAccessLogs({ limit: 10 }).subscribe({
      next: (logs) => {
        this.recentScans = logs.map((log: any) => ({
          id: log.id,
          participantName: `${log.firstName} ${log.lastName}`,
          eventName: log.eventName,
          badgeCategory: log.badgeCategory,
          timestamp: new Date(log.timestamp),
          accessType: log.accessType,
          status: 'success'
        }));
        this.updateDataSource();
      },
      error: () => {
        this.recentScans = this.generateMockScans();
        this.updateDataSource();
      }
    });
  }

  loadTodayStats(): void {
    // Charger les stats du jour
    this.apiService.getAccessLogs({ date: new Date().toISOString().split('T')[0] }).subscribe({
      next: (logs) => {
        this.todayStats.entries = logs.filter((l: any) => l.accessType === 'entry').length;
        this.todayStats.exits = logs.filter((l: any) => l.accessType === 'exit').length;
        this.todayStats.totalScans = logs.length;
        this.todayStats.currentAttendees = this.todayStats.entries - this.todayStats.exits;
      },
      error: () => {
        this.generateMockStats();
      }
    });
  }

  onScanSuccess(qrData: string): void {
    this.loading = true;
    
    this.apiService.validateQRCode(qrData, this.accessType).subscribe({
      next: (response) => {
        const scanRecord: ScanRecord = {
          id: `scan-${Date.now()}`,
          participantName: `${response.firstName} ${response.lastName}`,
          eventName: response.eventName,
          badgeCategory: response.badgeCategory,
          timestamp: new Date(),
          accessType: this.accessType,
          status: 'success'
        };

        this.lastScan = scanRecord;
        this.recentScans.unshift(scanRecord);
        this.updateDataSource();

        // Mettre à jour les stats
        if (this.accessType === 'entry') {
          this.todayStats.entries++;
          this.todayStats.currentAttendees++;
        } else {
          this.todayStats.exits++;
          this.todayStats.currentAttendees--;
        }
        this.todayStats.totalScans++;

        // Notification visuelle
        this.notificationService.success(
          `${this.accessType === 'entry' ? 'Entrée' : 'Sortie'} enregistrée pour ${response.firstName} ${response.lastName}`
        );

        // Afficher le scan avec animation
        this.showScanAnimation();

        this.loading = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'QR code invalide ou expiré';
        
        const failedScan: ScanRecord = {
          id: `scan-${Date.now()}`,
          participantName: 'Inconnu',
          eventName: 'N/A',
          badgeCategory: 'N/A',
          timestamp: new Date(),
          accessType: this.accessType,
          status: 'error'
        };

        this.lastScan = failedScan;
        this.recentScans.unshift(failedScan);
        this.updateDataSource();

        this.notificationService.error(errorMessage);
        this.loading = false;
      }
    });
  }

  onScanError(error: any): void {
    console.error('Erreur scanner:', error);
  }

  showScanAnimation(): void {
    // Animation visuelle du scan réussi
    const element = document.querySelector('.scan-result');
    if (element) {
      element.classList.add('scan-success-animation');
      setTimeout(() => {
        element.classList.remove('scan-success-animation');
      }, 1000);
    }
  }

  toggleScanner(): void {
    this.scannerActive = !this.scannerActive;
  }

  updateDataSource(): void {
    this.dataSource.data = this.recentScans.slice(0, 10);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  generateMockScans(): ScanRecord[] {
    const mockNames = [
      { first: 'Jean', last: 'Dupont' },
      { first: 'Marie', last: 'Martin' },
      { first: 'Pierre', last: 'Bernard' },
      { first: 'Sophie', last: 'Leclerc' },
      { first: 'Luc', last: 'Moreau' }
    ];

    const mockEvents = ['Conférence Innovation 2026', 'Workshop Angular 18', 'Sommet Tech Africa'];
    const mockCategories = ['VIP', 'Exposant', 'Visiteur'];

    const scans: ScanRecord[] = [];
    for (let i = 0; i < 8; i++) {
      const name = mockNames[Math.floor(Math.random() * mockNames.length)];
      scans.push({
        id: `scan-${i}`,
        participantName: `${name.first} ${name.last}`,
        eventName: mockEvents[Math.floor(Math.random() * mockEvents.length)],
        badgeCategory: mockCategories[Math.floor(Math.random() * mockCategories.length)],
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        accessType: Math.random() > 0.5 ? 'entry' : 'exit',
        status: 'success'
      });
    }
    return scans;
  }

  generateMockStats(): void {
    this.todayStats = {
      entries: 45,
      exits: 32,
      currentAttendees: 13,
      totalScans: 77
    };
  }

  clearLastScan(): void {
    this.lastScan = null;
  }

  exportScans(): void {
    const csv = this.convertToCSV(this.recentScans);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scans-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.notificationService.success('Scans exportés en CSV');
  }

  private convertToCSV(data: ScanRecord[]): string {
    const headers = ['Heure', 'Participant', 'Événement', 'Catégorie', 'Type', 'Statut'];
    const rows = data.map(scan => [
      scan.timestamp.toLocaleTimeString('fr-FR'),
      scan.participantName,
      scan.eventName,
      scan.badgeCategory,
      scan.accessType === 'entry' ? 'Entrée' : 'Sortie',
      scan.status === 'success' ? 'Succès' : 'Erreur'
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
    return status === 'success' ? 'success' : 'warn';
  }
}
