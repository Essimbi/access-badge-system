import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { OrganizationFormComponent } from '../organization-form/organization-form.component';
import { Organization } from '../../../core/models/organization.model';

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './organization-list.html',
  styleUrl: './organization-list.scss'
})
export class OrganizationListComponent implements OnInit {
  organizations: Organization[] = [];
  dataSource = new MatTableDataSource<Organization>([]);
  displayedColumns: string[] = ['name', 'email', 'admin', 'events', 'status', 'actions'];
  loading = false;
  searchQuery = '';
  statusFilter = 'all';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.loading = true;
    this.apiService.getOrganizations().subscribe({
      next: (data) => {
        this.organizations = data;
        this.updateDataSource();
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.error('Erreur lors du chargement des organisations');
        this.loading = false;
        // Mock data for development if API fails
        this.organizations = this.getMockOrganizations();
        this.updateDataSource();
      }
    });
  }

  updateDataSource(): void {
    let filtered = [...this.organizations];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(query) ||
        org.email.toLowerCase().includes(query)
      );
    }

    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      filtered = filtered.filter(org => org.is_active === isActive);
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

  deleteOrganization(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer l\'organisation',
        message: 'Êtes-vous sûr de vouloir supprimer cette organisation ? Cette action supprimera également tous les événements associés.',
        confirmText: 'Supprimer',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteOrganization(id).subscribe({
          next: () => {
            this.notificationService.success('Organisation supprimée');
            this.loadOrganizations();
          },
          error: () => this.notificationService.error('Erreur lors de la suppression')
        });
      }
    });
  }

  openOrgForm(organization: Organization | null = null): void {
    const dialogRef = this.dialog.open(OrganizationFormComponent, {
      width: '700px',
      data: { organization }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOrganizations();
      }
    });
  }

  toggleStatus(org: Organization): void {
    const newStatus = !org.is_active;
    this.apiService.updateOrganization(org.id, { is_active: newStatus }).subscribe({
      next: () => {
        org.is_active = newStatus;
        this.notificationService.success(`Organisation ${newStatus ? 'activée' : 'désactivée'} (Simulation)`);
      },
      error: () => this.notificationService.error('Erreur lors du changement de statut')
    });
  }

  exportCSV(): void {
    const headers = ['ID', 'Nom', 'Email', 'Active', 'Evénements', 'Date de création'];
    const rows = this.dataSource.data.map(org => [
      org.id,
      org.name,
      org.email,
      org.is_active ? 'Oui' : 'Non',
      org.eventCount || 0,
      org.createdAt ? new Date(org.createdAt).toLocaleDateString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `organisations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.notificationService.success('Export CSV réussi');
  }

  private getMockOrganizations(): Organization[] {
    return [
      {
        id: 1,
        name: 'Tech Sud Solutions',
        description: 'Solutions technologiques pour le sud de la France.',
        email: 'contact@techsud.fr',
        is_active: true,
        eventCount: 5,
        adminUser: { id: 2, firstName: 'Alice', lastName: 'Martin', email: 'alice@techsud.fr', role: 'admin' } as any,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Event Horizon',
        description: 'Organisation d\'événements astronomiques.',
        email: 'info@event-horizon.com',
        is_active: true,
        eventCount: 2,
        adminUser: { id: 3, firstName: 'Bob', lastName: 'Vance', email: 'bob@event-horizon.com', role: 'admin' } as any,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}
