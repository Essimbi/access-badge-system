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
    templateUrl: './badge-list.html',
    styleUrl: './badge-list.scss'

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
