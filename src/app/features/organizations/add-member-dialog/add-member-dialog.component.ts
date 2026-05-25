import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models/user.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-add-member-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule
    ],
    template: `
    <h2 mat-dialog-title>Ajouter un membre</h2>
    <mat-dialog-content>
      <p class="mb-4 text-sm text-gray-600">Sélectionnez un utilisateur sans organisation pour l'ajouter à {{ data.orgName }}.</p>
      
      <div *ngIf="loading; else formContent" class="flex justify-center p-8">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      
      <ng-template #formContent>
        <form [formGroup]="addMemberForm" class="pt-2">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Utilisateurs disponibles</mat-label>
            <mat-select formControlName="userId">
              <mat-option *ngIf="availableUsers.length === 0" disabled>Aucun utilisateur disponible</mat-option>
              <mat-option *ngFor="let user of availableUsers" [value]="user.id">
                {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
              </mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" [disabled]="submitting">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" 
              [disabled]="addMemberForm.invalid || submitting || availableUsers.length === 0">
        <span *ngIf="!submitting">Ajouter</span>
        <mat-spinner diameter="20" *ngIf="submitting"></mat-spinner>
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    .w-full { width: 100%; }
    mat-dialog-content { min-width: 450px; }
  `]
})
export class AddMemberDialogComponent implements OnInit {
    addMemberForm: FormGroup;
    availableUsers: User[] = [];
    loading = false;
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        public dialogRef: MatDialogRef<AddMemberDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { orgId: number, orgName: string }
    ) {
        this.addMemberForm = this.fb.group({
            userId: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadAvailableUsers();
    }

    loadAvailableUsers(): void {
        this.loading = true;
        this.apiService.getUsers().subscribe({
            next: (users) => {
                // Mock filter for users without an organization
                this.availableUsers = users.filter(u => !u.organization_id);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.addMemberForm.invalid) return;
        this.submitting = true;
        const userId = this.addMemberForm.value.userId;

        // Real API call to add member to organization
        this.apiService.addOrganizationMember(this.data.orgId, userId, 'VIEWER').subscribe({
            next: (response) => {
                this.dialogRef.close(response);
            },
            error: () => {
                this.submitting = false;
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
