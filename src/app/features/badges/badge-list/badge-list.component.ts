import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { BadgePreviewDialogComponent } from '../preview-dialog/badge-preview-dialog.component';
import { BadgePreviewService } from '../../../core/services/badge-preview.service';

@Component({
    selector: 'app-badge-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatDividerModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatSelectModule,
        RouterModule
    ],
    template: `
    <div class="badge-list-page p-8">
        <div class="page-header flex justify-between items-end mb-10">
            <div>
                <nav class="flex text-xs font-medium text-slate-400 mb-2 uppercase tracking-widest">
                    <span class="hover:text-primary cursor-pointer transition-colors">Dashboard</span>
                    <span class="mx-2">/</span>
                    <span class="text-slate-900">Modèles de Badges</span>
                </nav>
                <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Gestion des <span class="text-primary text-gradient">Badges</span></h1>
                <p class="text-slate-500 text-sm max-w-md leading-relaxed">
                    Gérez et personnalisez vos designs de badges par organisation.
                </p>
            </div>
            <div class="flex items-center gap-4">
                <!-- Org Filter for SuperAdmin -->
                <mat-form-field *ngIf="isSuperAdmin" appearance="outline" class="min-w-[240px] hide-hint">
                    <mat-label>Filtrer par Organisation</mat-label>
                    <mat-select [(ngModel)]="selectedOrgId" (selectionChange)="loadTemplates()">
                        <mat-option value="">Toutes les organisations</mat-option>
                        <mat-option value="global">Modèles Globaux (3CM)</mat-option>
                        <mat-divider></mat-divider>
                        <mat-option *ngFor="let org of organizations" [value]="org.id">
                            {{org.name}}
                        </mat-option>
                    </mat-select>
                </mat-form-field>

                <mat-button-toggle-group [(ngModel)]="viewMode" class="modern-toggle-group">
                    <mat-button-toggle value="table" matTooltip="Vue Tableau">
                        <mat-icon>table_chart</mat-icon>
                    </mat-button-toggle>
                    <mat-button-toggle value="grid" matTooltip="Vue Galerie">
                        <mat-icon>grid_view</mat-icon>
                    </mat-button-toggle>
                </mat-button-toggle-group>

                <div class="flex gap-3 border-l pl-4 border-slate-200">
                    <button mat-stroked-button class="btn-secondary" (click)="loadTemplates()">
                        <mat-icon>refresh</mat-icon>
                    </button>
                    <button mat-flat-button color="primary" class="btn-primary shadow-lg shadow-blue-200" routerLink="new">
                        <mat-icon>add</mat-icon>
                        Nouveau Design
                    </button>
                </div>
            </div>
        </div>

        <div *ngIf="loading" class="flex flex-col items-center justify-center p-24 bg-white/50 rounded-3xl border border-dashed border-slate-200">
            <mat-spinner diameter="40" class="mb-4"></mat-spinner>
            <p class="text-slate-400 font-medium animate-pulse">Chargement...</p>
        </div>

        <div *ngIf="!loading && dataSource.data.length === 0" class="flex flex-col items-center justify-center p-24 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <mat-icon class="text-slate-300 text-4xl w-10 h-10">style</mat-icon>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Aucun modèle trouvé</h3>
            <p class="text-slate-500 max-w-xs mb-8">Commencez par créer votre premier design de badge.</p>
            <button mat-flat-button color="primary" routerLink="new">Créer un badge</button>
        </div>

        <div *ngIf="!loading && dataSource.data.length > 0">
            
            <!-- TABLE VIEW (DEFAULT) -->
            <div *ngIf="viewMode === 'table'" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table mat-table [dataSource]="dataSource" class="w-full">
                    <ng-container matColumnDef="name">
                        <th mat-header-cell *matHeaderCellDef> Nom du Modèle </th>
                        <td mat-cell *matCellDef="let template"> 
                            <div class="flex items-center gap-3 py-2">
                                <div class="w-10 h-14 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    <div class="mini-badge-table scale-[0.15] origin-center" [innerHTML]="getSafePreview(template)"></div>
                                </div>
                                <span class="font-bold text-slate-900">{{template.templateName}}</span>
                            </div>
                        </td>
                    </ng-container>

                    <ng-container matColumnDef="organization">
                        <th mat-header-cell *matHeaderCellDef> Organisation </th>
                        <td mat-cell *matCellDef="let template">
                            <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider">
                                {{template.organizationName}}
                            </span>
                        </td>
                    </ng-container>

                    <ng-container matColumnDef="category">
                        <th mat-header-cell *matHeaderCellDef> Catégorie </th>
                        <td mat-cell *matCellDef="let template">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full" [style.backgroundColor]="getCategory(template.categoryId)?.color || '#94a3b8'"></div>
                                <span class="text-slate-600">{{getCategory(template.categoryId)?.name || 'Standard'}}</span>
                            </div>
                        </td>
                    </ng-container>

                    <ng-container matColumnDef="updatedAt">
                        <th mat-header-cell *matHeaderCellDef> Dernière Modification </th>
                        <td mat-cell *matCellDef="let template">
                            <span class="text-slate-400 text-xs">{{template.updatedAt | date:'dd/MM/yyyy HH:mm'}}</span>
                        </td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                        <th mat-header-cell *matHeaderCellDef></th>
                        <td mat-cell *matCellDef="let template" class="text-right">
                            <button mat-icon-button (click)="openPreview(template)" matTooltip="Visualiser">
                                <mat-icon class="text-slate-400">visibility</mat-icon>
                            </button>
                            <button mat-icon-button [routerLink]="['edit', template.id]" matTooltip="Modifier">
                                <mat-icon class="text-slate-400">edit</mat-icon>
                            </button>
                            <button mat-icon-button color="warn" (click)="deleteTemplate(template)" matTooltip="Supprimer">
                                <mat-icon>delete</mat-icon>
                            </button>
                        </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-slate-50 transition-colors"></tr>
                </table>
                <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons class="border-t"></mat-paginator>
            </div>

            <!-- GRID VIEW (GALLERY) -->
            <div *ngIf="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <div *ngFor="let template of dataSource.data" class="badge-card group">
                    <div class="badge-card__preview-container relative overflow-hidden bg-slate-100 rounded-2xl border border-slate-200 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:border-primary/30">
                        <div class="preview-scale p-4 flex items-center justify-center min-h-[280px]">
                            <div class="mini-badge shadow-lg bg-white rounded overflow-hidden" 
                                [innerHTML]="getSafePreview(template)"
                                [ngClass]="template.layout === 'landscape' ? 'mini-landscape' : 'mini-portrait'">
                            </div>
                        </div>
                        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                            <button mat-fab color="primary" class="scale-0 group-hover:scale-100 transition-transform duration-300 delay-75" (click)="openPreview(template)">
                                <mat-icon>visibility</mat-icon>
                            </button>
                            <button mat-fab class="bg-white text-slate-900 scale-0 group-hover:scale-100 transition-transform duration-300 delay-150" [routerLink]="['edit', template.id]">
                                <mat-icon>edit</mat-icon>
                            </button>
                        </div>
                        <div class="absolute top-4 left-4">
                            <span class="px-2 py-0.5 bg-black/60 backdrop-blur text-[8px] font-bold text-white uppercase rounded">
                                {{template.organizationName}}
                            </span>
                        </div>
                    </div>
                    <div class="mt-4 px-1">
                        <h3 class="text-lg font-bold text-slate-800 truncate mb-1">{{template.templateName}}</h3>
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full" [style.backgroundColor]="getCategory(template.categoryId)?.color || '#94a3b8'"></div>
                            <span class="text-[10px] font-bold text-slate-600 uppercase">{{getCategory(template.categoryId)?.name || 'Standard'}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .badge-list-page { animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .text-gradient { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    .btn-primary { border-radius: 12px; height: 48px; padding: 0 24px; font-weight: 600; letter-spacing: 0.02em; }
    .btn-secondary { border-radius: 12px; height: 48px; padding: 0 24px; border: 2px solid #e2e8f0; font-weight: 600; }

    .preview-scale { background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px; }

    .mini-badge { transform: scale(0.6); transform-origin: center; pointer-events: none; }
    .mini-badge-table { width: 60mm; height: 85mm; transform: scale(0.12); transform-origin: top center; pointer-events: none; }
    .mini-portrait { width: 60mm; height: 85mm; }
    .mini-landscape { width: 85mm; height: 60mm; }

    .badge-card__preview-container { position: relative; width: 100%; height: 220px; background: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; container-type: inline-size; }
    .badge-card__preview-container::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 0 40px rgba(0,0,0,0.02); pointer-events: none; }
    
    /* Responsive scaling for grid cards */
    @container (max-width: 400px) { .mini-badge { transform: scale(0.4); } }
    @container (max-width: 300px) { .mini-badge { transform: scale(0.3); } }
    @container (max-width: 250px) { .mini-badge { transform: scale(0.2); } }

    ::ng-deep .modern-menu { border-radius: 16px !important; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
    .hide-hint ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
  `]

})
export class BadgeListComponent implements OnInit {
    dataSource = new MatTableDataSource<any>([]);
    loading = false;
    viewMode: 'table' | 'grid' = 'table';
    categories: any[] = [];
    organizations: any[] = [];
    selectedOrgId: string | number = '';
    isSuperAdmin = false;
    displayedColumns: string[] = ['name', 'organization', 'category', 'updatedAt', 'actions'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer,
        private badgePreviewService: BadgePreviewService
    ) { }

    ngOnInit(): void {
        this.isSuperAdmin = this.apiService.hasRole('super_admin');
        this.loadCategories();
        this.loadTemplates();
        if (this.isSuperAdmin) {
            this.loadOrganizations();
        }
    }

    getSafePreview(template: any): SafeHtml {
        if (!template.htmlContent) return '';
        
        try {
            // Utiliser le service de preview unifié
            return this.badgePreviewService.generatePreview(template);
        } catch (error) {
            console.error('Error generating preview for template:', template.id, error);
            // Fallback: retourner le HTML brut interpolé
            return this.sanitizer.bypassSecurityTrustHtml(
                template.htmlContent
                    .replace(/{{firstName}}/g, 'Jean')
                    .replace(/{{lastName}}/g, 'Dupont')
                    .replace(/{{participant_name}}/g, 'Jean Dupont')
                    .replace(/{{role}}/g, 'Participant')
                    .replace(/{{organization}}/g, '3CM Event Solutions')
                    .replace(/{{event_title}}/g, 'Conférence Tech 2026')
                    .replace(/{{category}}/g, 'VIP')
                    .replace(/{{photo}}/g, '<img src="https://ui-avatars.com/api/?name=Jean+Dupont&background=0D8ABC&color=fff&size=128" style="width: 100%; height: 100%; object-fit: cover;">')
                    .replace(/{{{qr_code}}}/g, '<div style="background: #eee; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #999;">[QR CODE]</div>')
                    .replace(/{{qr_code}}/g, '<div style="background: #eee; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #999;">[QR CODE]</div>')
            );
        }
    }

    loadCategories(): void {
        this.apiService.getBadgeCategories().subscribe(cats => this.categories = cats);
    }

    loadOrganizations(): void {
        this.apiService.getOrganizations().subscribe(orgs => this.organizations = orgs);
    }

    loadTemplates(): void {
        this.loading = true;
        this.apiService.getBadgeTemplates(this.selectedOrgId).subscribe({
            next: (data) => {
                this.dataSource.data = data;
                if (this.paginator) this.dataSource.paginator = this.paginator;
                this.loading = false;
            },
            error: () => {
                this.notificationService.error('Erreur lors du chargement des modèles');
                this.loading = false;
            }
        });
    }

    getCategory(id: string | number): any {
        return this.categories.find(c => c.id === id);
    }

    openPreview(template: any): void {
        this.dialog.open(BadgePreviewDialogComponent, {
            width: '600px',
            data: { template }
        });
    }

    deleteTemplate(template: any): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Supprimer le modèle',
                message: `Voulez-vous vraiment supprimer le modèle "${template.templateName}" ?`,
                confirmText: 'Supprimer',
                isDestructive: true
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.apiService.deleteBadgeTemplate(template.id).subscribe({
                    next: () => {
                        this.notificationService.success('Modèle supprimé');
                        this.loadTemplates();
                    },
                    error: () => this.notificationService.error('Erreur lors de la suppression')
                });
            }
        });
    }
}
