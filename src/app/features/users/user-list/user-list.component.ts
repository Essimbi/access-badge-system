import { Component, OnInit } from '@angular/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewChild } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../../../core/models/user.model';
import { Organization } from '../../../core/models/organization.model';

@Component({
    selector: 'app-user-list',
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
        MatSlideToggleModule,
        MatTooltipModule
    ],
    templateUrl: './user-list.html',
    styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {
    users: User[] = [];
    organizations: Organization[] = [];
    dataSource = new MatTableDataSource<User>([]);
    loading = false;
    displayedColumns: string[] = ['name', 'email', 'role', 'organization', 'status', 'actions'];
    searchQuery = '';
    roleFilter = 'all';
    statusFilter = 'all';

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        private notificationService: NotificationService,
        private dialog: MatDialog
    ) {
        if (this.authService.hasRole('admin')) {
            this.displayedColumns = ['name', 'email', 'role', 'status', 'actions'];
        }
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        // Load users and organizations for mapping
        this.apiService.getOrganizations().subscribe({
            next: (orgs) => {
                this.organizations = orgs;
                this.loadUsers();
            },
            error: () => {
                this.notificationService.error('Erreur lors du chargement des organisations');
                this.loadUsers();
            }
        });
    }

    loadUsers(): void {
        this.apiService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.updateDataSource();
                this.loading = false;
            },
            error: () => {
                this.notificationService.error('Erreur lors du chargement des utilisateurs');
                this.loading = false;
            }
        });
    }

    updateDataSource(): void {
        let filtered = [...this.users];

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(u =>
                u.firstName.toLowerCase().includes(query) ||
                u.lastName.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query)
            );
        }

        if (this.roleFilter !== 'all') {
            filtered = filtered.filter(u => u.role === this.roleFilter);
        }

        if (this.statusFilter !== 'all') {
            const isActive = this.statusFilter === 'active';
            filtered = filtered.filter(u => u.is_active === isActive);
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

    onRoleFilterChange(role: string): void {
        this.roleFilter = role;
        this.updateDataSource();
    }

    onStatusFilterChange(status: string): void {
        this.statusFilter = status;
        this.updateDataSource();
    }

    getOrganizationName(orgId?: number): string {
        if (!orgId) return 'N/A';
        const org = this.organizations.find(o => o.id === orgId);
        return org ? org.name : 'Inconnue';
    }

    deleteUser(id: number): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Supprimer l\'utilisateur',
                message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
                confirmText: 'Supprimer',
                isDestructive: true
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.apiService.deleteUser(id).subscribe({
                    next: () => {
                        this.notificationService.success('Utilisateur supprimé (Simulation)');
                        this.users = this.users.filter(u => u.id !== id);
                    },
                    error: () => this.notificationService.error('Erreur lors de la suppression')
                });
            }
        });
    }

    openUserForm(user: User | null = null): void {
        const dialogRef = this.dialog.open(UserFormComponent, {
            width: '600px',
            data: { user }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadUsers();
            }
        });
    }

    toggleStatus(user: User): void {
        const newStatus = !user.is_active;
        this.apiService.updateUser(user.id, { is_active: newStatus }).subscribe({
            next: () => {
                user.is_active = newStatus;
                this.notificationService.success(`Utilisateur ${newStatus ? 'activé' : 'désactivé'} (Simulation)`);
            },
            error: () => this.notificationService.error('Erreur lors du changement de statut')
        });
    }

    exportCSV(): void {
        const headers = ['ID', 'Prénom', 'Nom', 'Email', 'Rôle', 'Organisation', 'Statut'];
        const rows = this.dataSource.data.map(u => [
            u.id,
            u.firstName,
            u.lastName,
            u.email,
            this.getRoleLabel(u.role),
            this.getOrganizationName(u.organization_id),
            u.is_active ? 'Actif' : 'Inactif'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.notificationService.success('Export CSV réussi');
    }

    getRoleLabel(role: string): string {
        const roles: { [key: string]: string } = {
            'super_admin': 'Super Admin',
            'admin': 'Administrateur',
            'controller': 'Contrôleur',
            'participant': 'Participant'
        };
        return roles[role] || role;
    }
}
