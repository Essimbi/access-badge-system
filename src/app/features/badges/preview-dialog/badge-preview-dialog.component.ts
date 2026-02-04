import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-badge-preview-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <div class="badge-preview-dialog bg-slate-100 p-8 flex flex-col items-center">
      <div class="flex justify-between items-center w-full mb-6">
        <h2 mat-dialog-title class="m-0">{{ data.template.templateName }}</h2>
        <button mat-icon-button (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Preview Container -->
      <div class="preview-container flex items-center justify-center min-h-[400px]">
        <!-- Visual Mode -->
        <div *ngIf="data.template.designMode !== 'html'"
             class="badge-preview shadow-2xl relative bg-white overflow-hidden transition-all duration-300"
             [ngClass]="data.template.layout === 'landscape' ? 'landscape-mode' : 'portrait-mode'"
             [style.border-radius.px]="data.template.borderRadius">
            
            <div class="badge-header flex items-center justify-center p-4 text-white"
                 [style.background-color]="data.template.primaryColor"
                 [style.height.%]="data.template.layout === 'landscape' ? 100 : 25"
                 [style.width.%]="data.template.layout === 'landscape' ? 35 : 100">
                <div class="text-center" *ngIf="data.template.showLogo">
                    <mat-icon class="text-3xl" [ngClass]="data.template.layout === 'landscape' ? 'w-10 h-10' : 'w-12 h-12 mb-1'">waves</mat-icon>
                    <div class="text-[8px] font-bold uppercase tracking-widest">{{ previewUser.organization }}</div>
                </div>
            </div>

            <div class="badge-body p-6 flex flex-col items-center text-center justify-center"
                 [style.width.%]="data.template.layout === 'landscape' ? 65 : 100">
                <div *ngIf="data.template.showAvatar"
                    class="avatar-box rounded-full bg-slate-200 border-4 border-white mb-4 shadow-lg flex items-center justify-center"
                    [ngClass]="data.template.layout === 'landscape' ? 'w-24 h-24' : 'w-20 h-20 -mt-16'">
                    <mat-icon class="text-slate-400 text-4xl w-10 h-10">person</mat-icon>
                </div>

                <h2 class="text-xl font-bold text-slate-800 mb-0">{{ previewUser.firstName }} {{ previewUser.lastName }}</h2>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">{{ previewUser.role }}</span>

                <div *ngIf="data.template.showQRCode"
                    class="qr-placeholder w-24 h-24 bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center justify-center">
                    <mat-icon class="text-slate-300 text-5xl w-14 h-14">qr_code_2</mat-icon>
                </div>
            </div>
        </div>

        <!-- HTML Mode -->
        <div *ngIf="data.template.designMode === 'html'"
             class="badge-preview-html shadow-2xl bg-white overflow-hidden p-6 rounded"
             [ngClass]="data.template.layout === 'landscape' ? 'landscape-mode-html' : 'portrait-mode-html'"
             [innerHTML]="safeHtml">
        </div>
      </div>

      <div class="mt-8">
        <button mat-flat-button color="primary" (click)="dialogRef.close()">
          Fermer l'aperçu
        </button>
      </div>
    </div>
  `,
    styles: [`
    .badge-preview {
        display: flex;
        background: white;
    }
    .portrait-mode {
        flex-direction: column;
        width: 60mm;
        height: 85mm;
    }
    .landscape-mode {
        flex-direction: row;
        width: 85mm;
        height: 60mm;
    }
    .portrait-mode-html {
        width: 60mm;
        height: 85mm;
    }
    .landscape-mode-html {
        width: 85mm;
        height: 60mm;
    }
    .badge-preview-dialog {
        border-radius: 12px;
        overflow: hidden;
    }
  `]
})
export class BadgePreviewDialogComponent implements OnInit {
    safeHtml: SafeHtml | null = null;
    previewUser = {
        firstName: 'Jean',
        lastName: 'Dupont',
        role: 'Participant VIP',
        organization: '3CM Event Solutions'
    };

    constructor(
        public dialogRef: MatDialogRef<BadgePreviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { template: any },
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        if (this.data.template.designMode === 'html' && this.data.template.htmlContent) {
            let interpolated = this.data.template.htmlContent
                .replace(/{{firstName}}/g, this.previewUser.firstName)
                .replace(/{{lastName}}/g, this.previewUser.lastName)
                .replace(/{{role}}/g, this.previewUser.role)
                .replace(/{{organization}}/g, this.previewUser.organization);
            this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(interpolated);
        }
    }
}
