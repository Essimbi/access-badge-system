import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog.component';
import { OrganizationFormComponent } from '../organization-form/organization-form.component';
import { Organization } from '../../../core/models/organization.model';

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDialogModule
  ],
  templateUrl: './organization-detail.html',
  styleUrl: './organization-detail.scss'
})
export class OrganizationDetailComponent implements OnInit {
  organization: Organization | null = null;
  loading = false;
  stats: any = null;
  events: any[] = [];
  members: any[] = [];
  activities: any[] = [];

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private authService: AuthService, // Added to constructor
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      const isMyOrg = url.some(segment => segment.path === 'my');

      if (isMyOrg) {
        this.authService.currentUser$.subscribe((user: User | null) => {
          if (user && user.organization_id) {
            this.handleId(user.organization_id);
          }
        });
      } else {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
          this.handleId(id);
        }
      }
    });
  }

  private handleId(id: number): void {
    this.loadOrganization(id);
    this.loadStats(id);
    this.loadEvents(id);
    this.loadMembers(id);
    this.loadActivities(id);
  }

  loadOrganization(id: number): void {
    this.loading = true;
    this.apiService.getOrganization(id).subscribe({
      next: (org) => {
        this.organization = org;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement de l\'organisation');
        this.loading = false;
      }
    });
  }

  loadStats(id: number): void {
    this.apiService.getOrganizationStats(id).subscribe({
      next: (stats) => this.stats = stats,
      error: () => console.error('Erreur stats')
    });
  }

  loadEvents(id: number): void {
    this.apiService.getEvents({ organizationId: id }).subscribe({
      next: (events) => this.events = events,
      error: () => console.error('Erreur events')
    });
  }

  loadMembers(id: number): void {
    this.apiService.getOrganizationMembers(id).subscribe({
      next: (members) => this.members = members,
      error: () => this.notificationService.error('Erreur lors du chargement des membres')
    });
  }

  loadActivities(id: number): void {
    this.apiService.getOrganizationActivities(id).subscribe({
      next: (activities) => this.activities = activities,
      error: () => console.error('Erreur activités')
    });
  }

  removeMember(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Retirer le membre',
        message: 'Êtes-vous sûr de vouloir retirer cet utilisateur de l\'organisation ?',
        confirmText: 'Retirer',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Simulating the update
        this.apiService.updateUser(userId, { organization_id: null }).subscribe({
          next: () => {
            this.notificationService.success('Membre retiré de l\'organisation (Simulation)');
            this.members = this.members.filter(m => m.id !== userId);
          },
          error: () => this.notificationService.error('Erreur lors de la suppression')
        });
      }
    });
  }

  openAddMemberDialog(): void {
    if (!this.organization) return;

    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '500px',
      data: {
        orgId: this.organization.id,
        orgName: this.organization.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.success('Membre ajouté avec succès (Simulation)');
        this.loadMembers(this.organization!.id);
      }
    });
  }

  openEditForm(): void {
    if (!this.organization) return;

    const dialogRef = this.dialog.open(OrganizationFormComponent, {
      width: '700px',
      data: { organization: this.organization }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOrganization(this.organization!.id);
      }
    });
  }
}
