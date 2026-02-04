import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatTooltipModule,
        MatDialogModule
    ],
    templateUrl: './user-detail.html',
    styleUrl: './user-detail.scss'
})
export class UserDetailComponent implements OnInit {
    user: User | null = null;
    loading = true;
    events: any[] = [];
    activities: any[] = [];
    stats: any = {
        totalEvents: 12,
        presenceRate: 85,
        lastActive: new Date()
    };

    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        private notificationService: NotificationService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadUser(id);
            this.loadUserActivities(id);
            this.loadUserEvents(id);
        }
    }

    loadUser(id: number): void {
        this.apiService.getUserById(id).subscribe({
            next: (user: User) => {
                this.user = user;
                this.loading = false;
            },
            error: () => {
                this.notificationService.error('Erreur lors du chargement de l\'utilisateur');
                this.loading = false;
            }
        });
    }

    loadUserActivities(id: number): void {
        // Simulated activities
        this.activities = [
            { id: 1, type: 'login', message: 'Connexion au système', date: new Date(Date.now() - 3600000) },
            { id: 2, type: 'event_join', message: 'Inscription à l\'événement "Conférence IA"', date: new Date(Date.now() - 86400000) },
            { id: 3, type: 'profile_update', message: 'Mise à jour du profil', date: new Date(Date.now() - 172800000) }
        ];
    }

    loadUserEvents(id: number): void {
        // Simulated events
        this.events = [
            { id: 1, title: 'Conférence IA 2026', date: new Date(), status: 'upcoming' },
            { id: 2, title: 'Workshop Angular Advanced', date: new Date(Date.now() - 86400000 * 5), status: 'completed' }
        ];
    }

    openEditForm(): void {
        if (!this.user) return;
        const dialogRef = this.dialog.open(UserFormComponent, {
            width: '600px',
            data: { user: this.user }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadUser(this.user!.id);
            }
        });
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
