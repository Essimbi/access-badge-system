import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { BadgePreviewDialogComponent } from '../preview-dialog/badge-preview-dialog.component';

@Component({
    selector: 'app-badge-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatDialogModule,
        RouterModule
    ],
    template: `
    <div class="badge-list-page p-6">
        <div class="page-header flex justify-between items-center mb-8">
            <div>
                <h1 class="page-header__title mb-1">Modèles de Badges</h1>
                <p class="text-slate-500 text-sm">Gérez vos designs et templates de badges</p>
            </div>
            <button mat-flat-button color="primary" routerLink="new">
                <mat-icon>add</mat-icon>
                Nouveau Design
            </button>
        </div>

        <div *ngIf="loading" class="flex justify-center p-12">
            <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div *ngIf="!loading" class="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table mat-table [dataSource]="dataSource" class="w-full">
                <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef> Nom du Modèle </th>
                    <td mat-cell *matCellDef="let template"> 
                        <span class="font-medium">{{template.templateName}}</span>
                    </td>
                </ng-container>

                <ng-container matColumnDef="mode">
                    <th mat-header-cell *matHeaderCellDef> Mode </th>
                    <td mat-cell *matCellDef="let template">
                        <span class="px-2 py-1 rounded text-[10px] uppercase font-bold"
                            [ngClass]="template.designMode === 'html' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                            {{template.designMode}}
                        </span>
                    </td>
                </ng-container>

                <ng-container matColumnDef="category">
                    <th mat-header-cell *matHeaderCellDef> Catégorie </th>
                    <td mat-cell *matCellDef="let template">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" [style.backgroundColor]="getCategory(template.categoryId)?.color"></div>
                            <span>{{getCategory(template.categoryId)?.name || 'N/A'}}</span>
                        </div>
                    </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef></th>
                    <td mat-cell *matCellDef="let template" class="text-right">
                        <button mat-icon-button (click)="openPreview(template)" matTooltip="Visualiser">
                            <mat-icon>visibility</mat-icon>
                        </button>
                        <button mat-icon-button [routerLink]="['edit', template.id]" matTooltip="Modifier">
                            <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteTemplate(template)" matTooltip="Supprimer">
                            <mat-icon>delete</mat-icon>
                        </button>
                    </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator [pageSizeOptions]="[10, 20]" showFirstLastButtons></mat-paginator>
        </div>
    </div>
  `,
    styles: [`
    .badge-list-page { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class BadgeListComponent implements OnInit {
    dataSource = new MatTableDataSource<any>([]);
    loading = false;
    categories: any[] = [];
    displayedColumns: string[] = ['name', 'mode', 'category', 'actions'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadCategories();
        this.loadTemplates();
    }

    loadCategories(): void {
        this.apiService.getBadgeCategories().subscribe(cats => this.categories = cats);
    }

    loadTemplates(): void {
        this.loading = true;
        this.apiService.getBadgeTemplates().subscribe({
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

    getCategory(id: number): any {
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
