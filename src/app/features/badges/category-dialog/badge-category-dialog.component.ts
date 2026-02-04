import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-badge-category-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
    <h2 mat-dialog-title>{{ data.category ? 'Modifier' : 'Ajouter' }} une Catégorie</h2>
    <mat-dialog-content>
      <form [formGroup]="categoryForm" class="flex flex-col gap-4 mt-4">
        <mat-form-field appearance="outline">
          <mat-label>Nom de la catégorie</mat-label>
          <input matInput formControlName="name" placeholder="ex: VIP, Exposant...">
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Couleur distinctive</mat-label>
          <input matInput type="color" formControlName="color">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-flat-button color="primary" [disabled]="categoryForm.invalid || submitting" (click)="onSubmit()">
        {{ data.category ? 'Mettre à jour' : 'Enregistrer' }}
      </button>
    </mat-dialog-actions>
  `
})
export class BadgeCategoryDialogComponent implements OnInit {
    categoryForm: FormGroup;
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private notificationService: NotificationService,
        public dialogRef: MatDialogRef<BadgeCategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { category: any }
    ) {
        this.categoryForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            color: ['#2563eb']
        });
    }

    ngOnInit(): void {
        if (this.data.category) {
            this.categoryForm.patchValue(this.data.category);
        }
    }

    onSubmit(): void {
        if (this.categoryForm.invalid) return;
        this.submitting = true;

        const action = this.data.category
            ? this.apiService.updateBadgeCategory(this.data.category.id, this.categoryForm.value)
            : this.apiService.createBadgeCategory(this.categoryForm.value);

        action.subscribe({
            next: () => {
                this.notificationService.success('Catégorie enregistrée');
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
