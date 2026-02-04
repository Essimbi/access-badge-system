import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { GateSettingsDialogComponent } from '../gate-settings-dialog/gate-settings-dialog.component';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-gate-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatChipsModule,
        MatDialogModule
    ],
    templateUrl: './gate-list.html',
    styleUrl: './gate-list.scss'
})
export class GateListComponent implements OnInit {
    gates: any[] = [];
    dataSource = new MatTableDataSource<any>([]);
    loading = false;
    displayedColumns: string[] = ['name', 'location', 'type', 'organization', 'status', 'actions'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadGates();
    }

    loadGates(): void {
        this.loading = true;
        // Mock simulation for access gates
        this.apiService.getAccessGates().subscribe({
            next: (data) => {
                this.gates = data;
                this.dataSource.data = data;
                if (this.paginator) this.dataSource.paginator = this.paginator;
                this.loading = false;
            },
            error: () => {
                this.notificationService.error('Erreur chargement des terminaux');
                this.loading = false;
            }
        });
    }

    toggleGateStatus(gate: any): void {
        gate.is_active = !gate.is_active;
        this.notificationService.success(`Terminal ${gate.is_active ? 'activé' : 'désactivé'}`);
    }

    openGateSettings(gate: any): void {
        const dialogRef = this.dialog.open(GateSettingsDialogComponent, {
            width: '600px',
            data: { gate }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadGates();
        });
    }
}
