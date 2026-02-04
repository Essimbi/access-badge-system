import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Organization } from '../../../core/models/organization.model';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    templateUrl: './user-form.html',
    styleUrl: './user-form.scss'
})
export class UserFormComponent implements OnInit {
    userForm: FormGroup;
    loading = false;
    submitting = false;
    isEditMode = false;
    userId: number | null = null;
    organizations: Organization[] = [];

    roles = [
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'admin', label: 'Administrateur' },
        { value: 'controller', label: 'Contrôleur' },
        { value: 'participant', label: 'Participant' }
    ];

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private authService: AuthService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private router: Router,
        public dialogRef: MatDialogRef<UserFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User | null }
    ) {
        this.userForm = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            role: ['participant', [Validators.required]],
            organization_id: [null],
            is_active: [true]
        });

        // Role-based restrictions
        if (this.authService.hasRole('admin')) {
            this.roles = this.roles.filter(r => r.value !== 'super_admin');
            const user = this.authService.currentUserValue;
            if (user && user.organization_id) {
                this.userForm.get('organization_id')?.setValue(user.organization_id);
                this.userForm.get('organization_id')?.disable();
            }
        }
    }

    ngOnInit(): void {
        this.loadOrganizations();
        if (this.data && this.data.user) {
            this.isEditMode = true;
            this.userId = this.data.user.id;
            this.userForm.patchValue(this.data.user);
        }
    }

    loadOrganizations(): void {
        this.apiService.getOrganizations().subscribe({
            next: (orgs) => this.organizations = orgs,
            error: () => this.notificationService.error('Erreur lors du chargement des organisations')
        });
    }

    patchUser(id: number): void {
        this.loading = true;
        this.apiService.getUsers().subscribe({
            next: (users) => {
                const user = users.find(u => u.id === id);
                if (user) {
                    this.userForm.patchValue(user);
                } else {
                    this.notificationService.error('Utilisateur non trouvé');
                    this.router.navigate(['/dashboard/users']);
                }
                this.loading = false;
            },
            error: () => {
                this.notificationService.error('Erreur lors du chargement de l\'utilisateur');
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.userForm.invalid) return;

        this.submitting = true;
        const userData = this.userForm.value;

        const request = this.isEditMode && this.userId
            ? this.apiService.updateUser(this.userId, userData)
            : this.apiService.createUser(userData);

        request.subscribe({
            next: () => {
                this.notificationService.success(
                    this.isEditMode ? 'Utilisateur mis à jour (Simulation)' : 'Utilisateur créé (Simulation)'
                );
                this.dialogRef.close(true);
            },
            error: () => {
                this.notificationService.error('Une erreur est survenue');
                this.submitting = false;
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
