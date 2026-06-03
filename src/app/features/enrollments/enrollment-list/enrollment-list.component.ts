import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-enrollment-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        RouterModule,
        MatDialogModule
    ],
    templateUrl: './enrollment-list.html',
    styleUrl: './enrollment-list.scss'
})
export class EnrollmentListComponent implements OnInit {
    enrollments: any[] = [];
    dataSource = new MatTableDataSource<any>([]);
    loading = false;
    displayedColumns: string[] = ['participant', 'event', 'date', 'status', 'actions'];

    searchQuery = '';
    statusFilter = 'all';

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadEnrollments();
    }

    loadEnrollments(): void {
        this.loading = true;
        // Mock simulation for global enrollments
        this.apiService.getEnrollments().subscribe({
            next: (data) => {
                this.enrollments = data;
                this.updateDataSource();
                this.loading = false;
            },
            error: () => {
                this.notificationService.error('Erreur chargement inscriptions');
                this.loading = false;
            }
        });
    }

    updateDataSource(): void {
        let filtered = [...this.enrollments];

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.userName.toLowerCase().includes(query) ||
                e.eventTitle.toLowerCase().includes(query)
            );
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

    onStatusFilterChange(status: string): void {
        this.statusFilter = status;
        this.updateDataSource();
    }

    deleteEnrollment(id: string): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Supprimer l\'inscription',
                message: 'Êtes-vous sûr de vouloir supprimer cette inscription ? Cette action est irréversible.',
                confirmText: 'Supprimer',
                isDestructive: true
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.apiService.deleteEnrollment(id).subscribe({
                    next: () => {
                        this.notificationService.success('Inscription supprimée');
                        this.loadEnrollments();
                    },
                    error: () => this.notificationService.error('Erreur suppression')
                });
            }
        });
    }
}
