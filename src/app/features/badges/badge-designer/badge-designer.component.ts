import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { MatMenuModule } from '@angular/material/menu';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BadgeCategoryDialogComponent } from '../category-dialog/badge-category-dialog.component';
import { BadgePreviewService } from '../../../core/services/badge-preview.service';
import { BadgePreviewDialogComponent } from '../preview-dialog/badge-preview-dialog.component';

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
        MatProgressSpinnerModule,
        MatMenuModule
    ],
    templateUrl: './badge-designer.html',
    styleUrl: './badge-designer.scss'
})
export class BadgeDesignerComponent implements OnInit {
    designMode: 'visual' | 'html' = 'html';
    categories: any[] = [];
    organizations: any[] = [];
    templateId: string | number | null = null;
    loading = false;
    isSuperAdmin = false;
    events: any[] = [];

    @ViewChild('previewIframe') previewIframe!: ElementRef<HTMLIFrameElement>;

    badgeSettings = {
        templateName: 'Nouveau Modèle',
        categoryId: null as string | number | null,
        organizationId: null as string | number | null,
        eventId: null as string | number | null,
        htmlContent: `
<div style="font-family: 'Inter', sans-serif; width: 100%; height: 100%; border: 1px solid #e2e8f0; border-radius: 12px; background: white; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: space-between;">
  <div style="text-align: center;">
    <h3 style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">{{event_title}}</h3>
    <h1 style="margin: 10px 0 5px 0; color: #1e293b; font-size: 24px;">{{firstName}} {{lastName}}</h1>
    <span style="background: #eff6ff; color: #2563eb; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">{{category}}</span>
  </div>
  
  <div style="width: 100px; height: 100px; background: #f8fafc; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 4px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
    {{photo}}
  </div>

  <div style="text-align: center; width: 80px; height: 80px;">
    {{qr_code}}
  </div>
  
  <div style="font-size: 10px; color: #94a3b8;">{{organization}}</div>
</div>`,
        layout: 'portrait',
        // Dimensions personnalisables (en mm)
        widthMM: 60,
        heightMM: 85,
        // Permet de verrouiller/déverrouiller les proportions
        lockAspectRatio: true
    };

    
    previewUser = {
        firstName: 'Jean',
        lastName: 'Dupont',
        role: 'Participant',
        organization: '3CM Event Solutions',
        event_title: 'Conférence Tech 2026',
        category: 'VIP',
        photo: '<img src="https://ui-avatars.com/api/?name=Jean+Dupont&background=0D8ABC&color=fff&size=128" style="width: 100%; height: 100%; object-fit: cover;">',
        qr_code: '<div style="background: #eee; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #999;">[QR CODE]</div>'
    };

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private router: Router,
        private badgePreviewService: BadgePreviewService
    ) { 
        this.isSuperAdmin = this.apiService.hasRole('super_admin');
    }

    ngOnInit(): void {
        this.loadCategories();
        
        if (this.isSuperAdmin) {
            this.loadOrganizations();
        }

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.templateId = id;
            this.loadTemplate(this.templateId);
        } else {
            // Setup defaults
            if (!this.isSuperAdmin) {
               // Load events for current user's org
               this.loadEvents();
            }
        }
    }

    loadTemplate(id: string | number): void {
        this.loading = true;
        this.apiService.getBadgeTemplateById(id).subscribe({
            next: (data) => {
                if (data) {
                    this.badgeSettings = { ...this.badgeSettings, ...data };
                    
                    if (this.badgeSettings.organizationId) {
                        this.loadEvents(this.badgeSettings.organizationId as number);
                    } else if (!this.isSuperAdmin) {
                        this.loadEvents();
                    }

                    try {
                        // Préprocesser le HTML chargé pour corriger les problèmes
                        this.badgeSettings.htmlContent = this.badgePreviewService.preprocessHtml(this.badgeSettings.htmlContent);
                    } catch (error) {
                        console.error('Error preprocessing HTML:', error);
                        // Continuer sans préprocessing si erreur
                    }
                    
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

    loadOrganizations(): void {
        this.apiService.getOrganizations().subscribe(orgs => this.organizations = orgs);
    }

    loadEvents(orgId?: number | string): void {
        this.apiService.getEvents().subscribe(allEvents => {
            if (orgId) {
                this.events = allEvents.filter((e: any) => e.org_id === orgId || e.organization_id === orgId);
            } else {
                this.events = allEvents;
            }
        });
    }

    onOrganizationChange(): void {
        this.badgeSettings.eventId = null;
        if (this.badgeSettings.organizationId) {
            this.loadEvents(this.badgeSettings.organizationId);
        } else {
            this.events = [];
        }
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
        try {
            // Préprocesser le HTML pour détecter et corriger les problèmes courants
            this.badgeSettings.htmlContent = this.badgePreviewService.preprocessHtml(this.badgeSettings.htmlContent);
        } catch (error) {
            console.error('Error preprocessing HTML on change:', error);
            // Continuer sans préprocessing si erreur
        }
        this.updateHtmlPreview();
    }

    // Nettoyer manuellement le HTML
    cleanupHtml(): void {
        try {
            const originalHtml = this.badgeSettings.htmlContent;
            const cleanedHtml = this.badgePreviewService.preprocessHtml(originalHtml);
            
            if (originalHtml !== cleanedHtml) {
                this.badgeSettings.htmlContent = cleanedHtml;
                this.updateHtmlPreview();
                this.notificationService.success('HTML nettoyé avec succès');
            } else {
                this.notificationService.info('Le HTML est déjà propre');
            }
        } catch (error) {
            console.error('Error cleaning HTML:', error);
            this.notificationService.error('Erreur lors du nettoyage du HTML');
        }
    }

    private updateHtmlPreview(): void {
        if (!this.previewIframe) return;

        const iframe = this.previewIframe.nativeElement;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        try {
            // Utiliser le service de preview pour générer le HTML de l'iframe
            const finalHtml = this.badgePreviewService.generateIframePreview(
                this.badgeSettings.htmlContent,
                this.previewUser
            );

            doc.open();
            doc.write(finalHtml);
            doc.close();
            
            // Mettre à jour les dimensions après le chargement du contenu
            setTimeout(() => this.updatePreviewDimensions(), 100);
        } catch (error) {
            console.error('Error updating HTML preview:', error);
            // Fallback: afficher un message d'erreur dans l'iframe
            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body { 
                                margin: 0; 
                                padding: 20px; 
                                font-family: Arial, sans-serif; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                height: 100vh; 
                                background: #f8f9fa; 
                                color: #dc3545; 
                                text-align: center; 
                            }
                        </style>
                    </head>
                    <body>
                        <div>
                            <h3>Erreur de rendu</h3>
                            <p>Impossible d'afficher l'aperçu</p>
                        </div>
                    </body>
                </html>
            `);
            doc.close();
        }
    }

    saveTemplate(): void {
        // Mapper les propriétés du front-end vers les noms attendus par le back-end
        // S'assurer que toutes les valeurs sont valides (pas null/undefined)
        const payload = {
            templateName: this.badgeSettings.templateName || 'Nouveau Modèle',
            designMode: 'html', // Toujours 'html' pour le badge designer
            htmlContent: this.badgeSettings.htmlContent || '',
            categoryId: this.badgeSettings.categoryId || null,
            organizationId: this.badgeSettings.organizationId || null,
            eventId: this.badgeSettings.eventId || null,
            layout: this.badgeSettings.layout || 'portrait',
            widthMM: Number(this.badgeSettings.widthMM) || 60,
            heightMM: Number(this.badgeSettings.heightMM) || 85,
            lockAspectRatio: Boolean(this.badgeSettings.lockAspectRatio)
        };

        console.log('Payload envoyé à l\'API:', payload);
        console.log('Template ID:', this.templateId);

        const action = this.templateId
            ? this.apiService.updateBadgeTemplate(this.templateId, payload)
            : this.apiService.createBadgeTemplate(payload);

        action.subscribe({
            next: (response) => {
                console.log('Réponse API succès:', response);
                this.notificationService.success(this.templateId ? 'Modèle mis à jour' : 'Modèle créé');
                this.router.navigate(['/dashboard/badges']);
            },
            error: (error) => {
                console.error('Erreur API détaillée:', error);
                console.error('Status:', error.status);
                console.error('Message:', error.message);
                console.error('Error body:', error.error);
                this.notificationService.error('Erreur lors de la sauvegarde: ' + (error.message || 'Erreur inconnue'));
            }
        });
    }

    exportPreview(): void {
        this.openPreviewModal();
    }

    openPreviewModal(): void {
        const payload = {
            templateName: this.badgeSettings.templateName || 'Nouveau Modèle',
            designMode: 'html',
            htmlContent: this.badgeSettings.htmlContent || '',
            layout: this.badgeSettings.layout || 'portrait',
            widthMM: Number(this.badgeSettings.widthMM) || 60,
            heightMM: Number(this.badgeSettings.heightMM) || 85,
            lockAspectRatio: Boolean(this.badgeSettings.lockAspectRatio)
        };

        this.dialog.open(BadgePreviewDialogComponent, {
            width: '800px',
            maxWidth: '90vw',
            data: { template: payload }
        });
    }

    // Convertir les millimètres en pixels (96 DPI standard)
    mmToPx(mm: number): number {
        return (mm * 96) / 25.4;
    }

    // Obtenir les dimensions actuelles du badge en pixels
    getBadgeDimensions(): { width: number; height: number } {
        return {
            width: this.mmToPx(this.badgeSettings.widthMM),
            height: this.mmToPx(this.badgeSettings.heightMM)
        };
    }

    // Gérer le changement de dimensions
    onDimensionChange(dimension: 'width' | 'height', value: number): void {
        if (dimension === 'width') {
            this.badgeSettings.widthMM = value;
            if (this.badgeSettings.lockAspectRatio) {
                // Maintenir le ratio si verrouillé
                const ratio = this.badgeSettings.heightMM / this.badgeSettings.widthMM;
                this.badgeSettings.heightMM = Math.round(value * ratio);
            }
        } else {
            this.badgeSettings.heightMM = value;
            if (this.badgeSettings.lockAspectRatio) {
                // Maintenir le ratio si verrouillé
                const ratio = this.badgeSettings.widthMM / this.badgeSettings.heightMM;
                this.badgeSettings.widthMM = Math.round(value * ratio);
            }
        }
        this.updatePreviewDimensions();
    }

    // Mettre à jour les dimensions de l'iframe de prévisualisation
    private updatePreviewDimensions(): void {
        if (!this.previewIframe) return;
        
        const dimensions = this.getBadgeDimensions();
        const iframe = this.previewIframe.nativeElement;
        const wrapper = iframe.closest('.badge-canvas-wrap') as HTMLElement;
        
        if (wrapper) {
            wrapper.style.width = `${dimensions.width}px`;
            wrapper.style.height = `${dimensions.height}px`;
        }
    }

    // Basculer le verrouillage des proportions
    toggleAspectRatioLock(): void {
        this.badgeSettings.lockAspectRatio = !this.badgeSettings.lockAspectRatio;
    }

    // Changer l'orientation et ajuster les dimensions
    onOrientationChange(): void {
        if (this.badgeSettings.layout === 'landscape') {
            // Inverser les dimensions pour le mode paysage
            const temp = this.badgeSettings.widthMM;
            this.badgeSettings.widthMM = this.badgeSettings.heightMM;
            this.badgeSettings.heightMM = temp;
        } else {
            // Revenir aux dimensions portrait standard
            const temp = this.badgeSettings.widthMM;
            this.badgeSettings.widthMM = this.badgeSettings.heightMM;
            this.badgeSettings.heightMM = temp;
        }
        this.updatePreviewDimensions();
    }
}
