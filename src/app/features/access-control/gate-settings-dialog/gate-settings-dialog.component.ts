import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-gate-settings-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatDividerModule
    ],
    template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
        <mat-icon color="primary">settings</mat-icon>
        Réglages du Terminal : {{ data.gate.name }}
    </h2>
    <mat-dialog-content>
        <mat-tab-group class="mt-4">
            <!-- Technical Tab -->
            <mat-tab label="Technique">
                <form [formGroup]="settingsForm" class="flex flex-col gap-4 p-4">
                    <mat-form-field appearance="outline">
                        <mat-label>Identifiant Matériel (UDID)</mat-label>
                        <input matInput formControlName="deviceId" readonly>
                        <mat-icon matSuffix class="text-slate-400">fingerprint</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Adresse IP Statique (Facultatif)</mat-label>
                        <input matInput formControlName="ipAddress" placeholder="ex: 192.168.1.100">
                    </mat-form-field>
                </form>
            </mat-tab>

            <!-- Logical Tab -->
            <mat-tab label="Affectation">
                <form [formGroup]="settingsForm" class="flex flex-col gap-4 p-4">
                    <mat-form-field appearance="outline">
                        <mat-label>Sens de contrôle</mat-label>
                        <mat-select formControlName="direction">
                            <mat-option value="entry">ENTRÉE Uniquement</mat-option>
                            <mat-option value="exit">SORTIE Uniquement</mat-option>
                            <mat-option value="both">ENTRÉE & SORTIE</mat-option>
                        </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Restriction par Catégorie</mat-label>
                        <mat-select formControlName="restrictedCategories" multiple>
                            <mat-option *ngFor="let cat of categories" [value]="cat.id">
                                {{ cat.name }}
                            </mat-option>
                        </mat-select>
                        <mat-hint>Laissez vide pour autoriser toutes les catégories</mat-hint>
                    </mat-form-field>
                </form>
            </mat-tab>

            <!-- Advanced Tab -->
            <mat-tab label="Paramètres Scan">
                <form [formGroup]="settingsForm" class="flex flex-col gap-6 p-4">
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                            <div class="font-medium">Mode Hors-ligne</div>
                            <div class="text-[10px] text-slate-500">Stockage local si perte de connexion</div>
                        </div>
                        <mat-slide-toggle formControlName="offlineMode" color="primary"></mat-slide-toggle>
                    </div>

                    <mat-form-field appearance="outline">
                        <mat-label>Délai entre scans (ms)</mat-label>
                        <input matInput type="number" formControlName="scanDelay">
                        <mat-icon matSuffix class="text-slate-400">timer</mat-icon>
                        <mat-hint>Évite les doubles validations accidentelles</mat-hint>
                    </mat-form-field>

                    <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                        <div>
                            <div class="font-medium text-red-700">Verrouiller le Terminal</div>
                            <div class="text-[10px] text-red-500">Bloquer tout scan immédiatement</div>
                        </div>
                        <mat-slide-toggle formControlName="isLocked" color="warn"></mat-slide-toggle>
                    </div>
                </form>
            </mat-tab>
        </mat-tab-group>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="p-4 border-t">
        <button mat-button (click)="onCancel()">Annuler</button>
        <button mat-flat-button color="primary" [disabled]="settingsForm.invalid || submitting" (click)="onSubmit()">
            Enregistrer les modifications
        </button>
    </mat-dialog-actions>
  `,
    styles: [`
    :host { display: block; min-width: 500px; }
    mat-dialog-content { min-height: 400px; }
  `]
})
export class GateSettingsDialogComponent implements OnInit {
    settingsForm: FormGroup;
    submitting = false;
    categories: any[] = [];

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private notificationService: NotificationService,
        public dialogRef: MatDialogRef<GateSettingsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { gate: any }
    ) {
        this.settingsForm = this.fb.group({
            deviceId: [data.gate.deviceId || 'DEV-' + Math.random().toString(36).substr(2, 9).toUpperCase()],
            ipAddress: [data.gate.ipAddress || ''],
            direction: [data.gate.direction || 'both', Validators.required],
            restrictedCategories: [data.gate.restrictedCategories || []],
            offlineMode: [data.gate.offlineMode || true],
            scanDelay: [data.gate.scanDelay || 2000, [Validators.required, Validators.min(0)]],
            isLocked: [data.gate.isLocked || false]
        });
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.apiService.getBadgeCategories().subscribe(cats => this.categories = cats);
    }

    onSubmit(): void {
        if (this.settingsForm.invalid) return;
        this.submitting = true;

        // Simulate update call
        this.apiService.updateGateSettings(this.data.gate.id, this.settingsForm.value).subscribe({
            next: () => {
                this.notificationService.success('Paramètres du terminal mis à jour');
                this.dialogRef.close(true);
            },
            error: () => {
                this.notificationService.error('Erreur lors de la sauvegarde');
                this.submitting = false;
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
