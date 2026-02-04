import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BadgeCategoryDialogComponent } from '../category-dialog/badge-category-dialog.component';

@Component({
    selector: 'app-badge-designer',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSliderModule,
        MatDividerModule,
        MatTooltipModule,
        MatButtonToggleModule,
        RouterModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './badge-designer.html',
    styleUrl: './badge-designer.scss'
})
export class BadgeDesignerComponent implements OnInit {
    designMode: 'visual' | 'html' = 'visual';
    categories: any[] = [];
    templateId: number | null = null;
    loading = false;

    badgeSettings = {
        templateName: 'Template Par Défaut',
        categoryId: null as number | null,
        width: 60,
        height: 85,
        borderRadius: 8,
        primaryColor: '#2563eb',
        showAvatar: true,
        showQRCode: true,
        showLogo: true,
        htmlContent: '',
        fontFamily: "'Inter', sans-serif",
        layout: 'portrait'
    };

    safeHtmlPreview: SafeHtml | null = null;

    previewUser = {
        firstName: 'Jean',
        lastName: 'Dupont',
        role: 'Participant',
        organization: '3CM Event Solutions'
    };

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCategories();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.templateId = +id;
            this.loadTemplate(this.templateId);
        }
    }

    loadTemplate(id: number): void {
        this.loading = true;
        this.apiService.getBadgeTemplateById(id).subscribe({
            next: (data) => {
                if (data) {
                    this.badgeSettings = { ...this.badgeSettings, ...data };
                    this.designMode = data.designMode || 'visual';
                    this.updateHtmlPreview();
                }
                this.loading = false;
            },
            error: () => {
                this.notificationService.error('Erreur lors du chargement du modèle');
                this.loading = false;
            }
        });
    }

    loadCategories(): void {
        this.apiService.getBadgeCategories().subscribe(cats => this.categories = cats);
    }

    openCategoryManager(): void {
        const dialogRef = this.dialog.open(BadgeCategoryDialogComponent, {
            width: '450px',
            data: { category: null }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadCategories();
        });
    }

    onHtmlChange(): void {
        this.updateHtmlPreview();
    }

    private updateHtmlPreview(): void {
        if (!this.badgeSettings.htmlContent) {
            this.safeHtmlPreview = null;
            return;
        }

        // Simple interpolation for preview
        let interpolated = this.badgeSettings.htmlContent
            .replace(/{{firstName}}/g, this.previewUser.firstName)
            .replace(/{{lastName}}/g, this.previewUser.lastName)
            .replace(/{{role}}/g, this.previewUser.role)
            .replace(/{{organization}}/g, this.previewUser.organization);

        this.safeHtmlPreview = this.sanitizer.bypassSecurityTrustHtml(interpolated);
    }

    saveTemplate(): void {
        const action = this.templateId
            ? this.apiService.updateBadgeTemplate(this.templateId, this.badgeSettings)
            : this.apiService.createBadgeTemplate(this.badgeSettings);

        action.subscribe({
            next: () => {
                this.notificationService.success(this.templateId ? 'Modèle mis à jour' : 'Modèle créé');
                this.router.navigate(['/dashboard/badges']);
            },
            error: () => this.notificationService.error('Erreur lors de la sauvegarde')
        });
    }

    exportPreview(): void {
        this.notificationService.info('Génération de l\'aperçu PDF...');
    }
}
