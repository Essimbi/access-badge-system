import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-audit-logs',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatChipsModule,
        MatCardModule
    ],
    templateUrl: './audit-logs.html',
    styleUrl: './audit-logs.scss'
})
export class AuditLogsComponent implements OnInit {
    logs: any[] = [
        { id: 1, user: 'Super Admin', action: 'ORGANIZATION_CREATE', details: 'Nouvelle organisation: TechHub', date: new Date(), severity: 'info' },
        { id: 2, user: 'Admin 3CM', action: 'USER_DELETE', details: 'Utilisateur ID: 45 supprimé', date: new Date(Date.now() - 3600000), severity: 'warning' },
        { id: 3, user: 'System', action: 'CONFIG_UPDATE', details: 'Paramètres email modifiés', date: new Date(Date.now() - 86400000), severity: 'info' },
        { id: 4, user: 'Unknown', action: 'LOGIN_FAILURE', details: 'IP: 10.0.0.5 tentait de se connecter', date: new Date(Date.now() - 3600000 * 5), severity: 'error' }
    ];

    dataSource = new MatTableDataSource<any>(this.logs);
    displayedColumns: string[] = ['date', 'severity', 'user', 'action', 'details'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor() { }

    ngOnInit(): void {
        setTimeout(() => {
            if (this.paginator) this.dataSource.paginator = this.paginator;
        });
    }
}
