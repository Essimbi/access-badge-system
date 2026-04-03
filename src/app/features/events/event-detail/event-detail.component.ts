import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="event-detail-page p-6">
      <div *ngIf="loading" class="flex justify-center items-center h-64">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && event">
        <!-- Header -->
        <div class="flex justify-between items-start mb-8">
          <div>
            <div class="flex items-center gap-4 mb-2">
              <button mat-icon-button routerLink="/dashboard/events" class="text-slate-400">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <h1 class="text-3xl font-extrabold text-slate-900 m-0">{{ event.title }}</h1>
              <span class="status-badge" [ngClass]="'status-badge--' + event.status">
                {{ statusLabel }}
              </span>
            </div>
            <p class="text-slate-500 ml-12">{{ event.type }} • {{ event.location }}</p>
          </div>
          <div class="flex gap-2">
            <button mat-stroked-button color="primary" [routerLink]="['/dashboard/events/edit', event.id]">
              <mat-icon>edit</mat-icon>
              Modifier
            </button>
            <button mat-flat-button color="primary" (click)="printAllBadges()" [disabled]="printing">
              <mat-icon *ngIf="!printing">print</mat-icon>
              <mat-spinner diameter="18" *ngIf="printing" class="mr-2"></mat-spinner>
              Imprimer tout les badges
            </button>
            <button mat-stroked-button color="warn" (click)="deleteEvent()">
              <mat-icon>delete</mat-icon>
              Supprimer
            </button>
          </div>
        </div>

        <!-- Dashboard Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <mat-card class="p-4 bg-blue-50 border-none shadow-sm">
             <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">Inscrits</span>
             <div class="text-2xl font-black text-blue-900">
                {{ participants.length }} <span *ngIf="event.participantLimit" class="text-sm font-normal text-blue-700">/ {{ event.participantLimit }}</span>
             </div>
           </mat-card>
           <mat-card class="p-4 bg-emerald-50 border-none shadow-sm">
             <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Présents</span>
             <div class="text-2xl font-black text-emerald-900">{{ checkedInCount }}</div>
           </mat-card>
           <mat-card class="p-4 bg-purple-50 border-none shadow-sm">
             <span class="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">Badges Imprimés</span>
             <div class="text-2xl font-black text-purple-900">{{ printedCount }}</div>
           </mat-card>
           <mat-card class="p-4 bg-orange-50 border-none shadow-sm">
             <span class="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-1">En attente</span>
             <div class="text-2xl font-black text-orange-900">{{ pendingCount }}</div>
           </mat-card>
        </div>

        <mat-tab-group class="custom-tabs">
          <mat-tab label="Informations Générales">
            <div class="pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2">
                <mat-card class="p-6 border shadow-sm">
                  <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                    <mat-icon class="text-blue-500">description</mat-icon>
                    Description
                  </h3>
                  <p class="text-slate-600 leading-relaxed">{{ event.description }}</p>
                  
                  <hr class="my-6 border-slate-100">
                  
                  <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                    <mat-icon class="text-blue-500">location_on</mat-icon>
                    Lieu & Organisation
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">L</div>
                      <div>
                        <p class="text-[10px] text-slate-400 font-bold uppercase m-0 leading-tight">Lieu de l'événement</p>
                        <p class="text-sm font-medium m-0">{{ event.location }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">O</div>
                      <div>
                        <p class="text-[10px] text-slate-400 font-bold uppercase m-0 leading-tight">Organisation</p>
                        <p class="text-sm font-medium m-0">{{ organizationName }}</p>
                      </div>
                    </div>
                  </div>
                </mat-card>
              </div>

              <div>
                <mat-card class="p-6 border shadow-sm h-fit">
                  <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                    <mat-icon class="text-blue-500">calendar_today</mat-icon>
                    Planification
                  </h3>
                  <div class="space-y-4">
                    <div class="flex flex-col">
                      <span class="text-[10px] text-slate-400 font-bold uppercase m-0">Dates</span>
                      <span class="text-sm font-medium">
                        {{ event.date | date:'medium' }} 
                        <span *ngIf="event.endDate"> - {{ event.endDate | date:'medium' }}</span>
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[10px] text-slate-400 font-bold uppercase m-0">Statut actuel</span>
                      <mat-chip-set>
                        <mat-chip class="status-chip--{{event.status}}">{{ statusLabel }}</mat-chip>
                      </mat-chip-set>
                    </div>
                  </div>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Participants & Badges">
            <div class="pt-8">
              <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table mat-table [dataSource]="dataSource" class="w-full">
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef> Participant </th>
                    <td mat-cell *matCellDef="let p" class="font-medium"> {{ p.userName }} </td>
                  </ng-container>

                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef> ID </th>
                    <td mat-cell *matCellDef="let p" class="text-xs text-slate-400"> #{{ p.id }} </td>
                  </ng-container>

                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef> Inscription </th>
                    <td mat-cell *matCellDef="let p" class="text-sm text-slate-500"> {{ p.registeredAt | date:'short' }} </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Statut </th>
                    <td mat-cell *matCellDef="let p">
                      <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase"
                        [ngClass]="p.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                        {{ p.status }}
                      </span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef></th>
                    <td mat-cell *matCellDef="let p" class="text-right">
                      <button mat-icon-button [matMenuTriggerFor]="pMenu">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #pMenu="matMenu">
                        <button mat-menu-item (click)="printBadge(p)">
                          <mat-icon>print</mat-icon>
                          <span>Imprimer badge</span>
                        </button>
                        <button mat-menu-item>
                          <mat-icon>email</mat-icon>
                          <span>Envoyer par mail</span>
                        </button>
                      </mat-menu>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
                <mat-paginator [pageSizeOptions]="[10, 20, 50]" showFirstLastButtons></mat-paginator>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .event-detail-page { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .status-badge--upcoming { background: #e0f2fe; color: #0369a1; }
    .status-badge--ongoing { background: #dcfce7; color: #15803d; }
    .status-badge--completed { background: #f1f5f9; color: #475569; }
  `]
})
export class EventDetailComponent implements OnInit {
  event: any = null;
  loading = true;
  printing = false;
  organizationName = 'Chargement...';
  participants: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'id', 'date', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadEvent(id);
      this.loadParticipants(id);
    });
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.apiService.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loadOrganization(event.organization_id);
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement de l\'événement');
        this.loading = false;
      }
    });
  }

  loadOrganization(orgId: number): void {
    this.apiService.getOrganizations().subscribe(orgs => {
      const org = orgs.find(o => o.id === orgId);
      this.organizationName = org ? org.name : 'Inconnue';
    });
  }

  loadParticipants(id: number): void {
    this.apiService.getEventEnrollments(id).subscribe(data => {
      this.participants = data;
      this.dataSource.data = data;
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
  }

  get statusLabel(): string {
    if (!this.event) return '';
    switch (this.event.status) {
      case 'upcoming': return 'À venir';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminé';
      default: return this.event.status;
    }
  }

  get checkedInCount(): number {
    return this.participants.filter(p => p.status === 'confirmed').length;
  }

  get printedCount(): number {
    // Simulated count
    return Math.floor(this.checkedInCount * 0.8);
  }

  get pendingCount(): number {
    return this.participants.filter(p => p.status === 'pending').length;
  }

  printBadge(participant: any): void {
    this.notificationService.success(`Impression du badge pour ${participant.userName}...`);
    this.apiService.downloadParticipantBadge(participant.id).subscribe();
  }

  printAllBadges(): void {
    this.printing = true;
    this.apiService.printBadges(this.event.id).subscribe({
      next: (res) => {
        this.notificationService.success(res.message || 'Impression en masse lancée');
        this.printing = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du lancement de l\'impression');
        this.printing = false;
      }
    });
  }

  deleteEvent(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer l\'événement',
        message: `Êtes-vous sûr de vouloir supprimer "${this.event?.title}" ?`,
        confirmText: 'Supprimer',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.event) {
        this.apiService.deleteEvent(this.event.id).subscribe({
          next: () => {
            this.notificationService.success('Événement supprimé');
            this.router.navigate(['/dashboard/events']);
          },
          error: () => this.notificationService.error('Erreur lors de la suppression')
        });
      }
    });
  }
}
