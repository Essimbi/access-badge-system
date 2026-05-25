import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-event-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatChipsModule
    ],
    templateUrl: './event-list.html',
    styleUrl: './event-list.scss'
})
export class EventListComponent implements OnInit {
    events: any[] = [];
    organizations: any[] = [];
    dataSource = new MatTableDataSource<any>([]);
    loading = false;
    displayedColumns: string[] = ['name', 'organization', 'date', 'location', 'type', 'status', 'actions'];

    searchQuery = '';
    orgFilter = 'all';
    statusFilter = 'all';

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        this.apiService.getOrganizations().subscribe({
            next: (orgs) => {
                this.organizations = orgs;
                this.loadEvents();
            },
            error: () => {
                this.notificationService.error('Erreur chargement organisations');
                this.loadEvents();
            }
        });
    }

    loadEvents(): void {
        this.apiService.getEvents().subscribe({
            next: (events) => {
                this.events = events;
                this.updateDataSource();
                this.loading = false;
            },
            error: () => {
                this.notificationService.error('Erreur chargement événements');
                this.loading = false;
            }
        });
    }

    updateDataSource(): void {
        let filtered = [...this.events];

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.title.toLowerCase().includes(query) ||
                e.location.toLowerCase().includes(query)
            );
        }

        if (this.orgFilter !== 'all') {
            filtered = filtered.filter(e => e.organization_id === this.orgFilter);
        }

        if (this.statusFilter !== 'all') {
            filtered = filtered.filter(e => e.status === this.statusFilter);
        }

        this.dataSource.data = filtered;
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
        }
    }

    onSearchChange(query: string): void {
        this.searchQuery = query;
        this.updateDataSource();
    }

    onOrgFilterChange(orgId: string): void {
        this.orgFilter = orgId;
        this.updateDataSource();
    }

    onStatusFilterChange(status: string): void {
        this.statusFilter = status;
        this.updateDataSource();
    }

    getOrganizationName(orgId: string | number): string {
        const org = this.organizations.find(o => o.id === orgId);
        return org ? org.name : 'Inconnue';
    }

    deleteEvent(event: any): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Supprimer l\'événement',
                message: `Êtes-vous sûr de vouloir supprimer "${event.title}" ?`,
                confirmText: 'Supprimer',
                isDestructive: true
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.apiService.deleteEvent(event.id).subscribe({
                    next: () => {
                        this.notificationService.success('Événement supprimé');
                        this.loadEvents();
                    },
                    error: () => this.notificationService.error('Erreur suppression')
                });
            }
        });
    }

    exportCSV(): void {
        const headers = ['ID', 'Titre', 'Organisation', 'Date', 'Lieu', 'Type', 'Statut'];
        const rows = this.dataSource.data.map(e => [
            e.id,
            e.title,
            this.getOrganizationName(e.organization_id),
            new Date(e.date).toLocaleString(),
            e.location,
            e.type,
            e.status
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `evenements_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
