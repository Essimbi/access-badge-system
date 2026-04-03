import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';
import { Organization } from '../../../core/models/organization.model';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  templateUrl: './organization-form.html',
  styleUrl: './organization-form.scss'
})
export class OrganizationFormComponent implements OnInit {
  orgForm: FormGroup;
  isEditMode = false;
  orgId?: number;
  loading = false;
  submitting = false;
  potentialAdmins: User[] = [];
  filteredAdmins: User[] = [];
  adminSearchControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<OrganizationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { organization: Organization | null }
  ) {
    this.orgForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
      phone: [''],
      address: [''],
      adminUserId: [null],
      logoUrl: [''],
      primaryColor: ['#3b82f6']
    });

    // Listen to search input changes for filtering
    this.adminSearchControl.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.filterAdmins(value);
      }
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.organization) {
      this.isEditMode = true;
      this.orgId = this.data.organization.id;
      this.orgForm.patchValue({
        name: this.data.organization.name,
        email: this.data.organization.email,
        description: this.data.organization.description,
        phone: this.data.organization.phone,
        address: this.data.organization.address,
        adminUserId: this.data.organization.adminUserId,
        logoUrl: this.data.organization.logoUrl,
        primaryColor: this.data.organization.primaryColor || '#3b82f6'
      });
    }
    this.loadPotentialAdmins();
  }

  loadOrganization(id: number): void {
    this.loading = true;
    this.apiService.getOrganization(id).subscribe({
      next: (org) => {
        this.orgForm.patchValue({
          name: org.name,
          email: org.email,
          description: org.description,
          phone: org.phone,
          address: org.address,
          adminUserId: org.adminUserId
        });
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement de l\'organisation');
        this.loading = false;
      }
    });
  }

  loadPotentialAdmins(): void {
    this.apiService.getUsers({ role: 'admin' }).subscribe({
      next: (users) => {
        this.potentialAdmins = users;
        this.filteredAdmins = users;

        // If editing and an admin is already selected, pre-fill the autocomplete
        if (this.isEditMode && this.data?.organization?.adminUserId) {
          const selected = users.find(u => u.id === this.data.organization!.adminUserId);
          if (selected) {
            this.adminSearchControl.setValue(selected as any);
          }
        }
      },
      error: () => console.error('Erreur chargement administrateurs')
    });
  }

  filterAdmins(query: string): void {
    const q = query.toLowerCase();
    this.filteredAdmins = this.potentialAdmins.filter(u =>
      (u.firstName?.toLowerCase() || '').includes(q) ||
      (u.lastName?.toLowerCase() || '').includes(q) ||
      (u.email?.toLowerCase() || '').includes(q)
    );
  }

  displayAdminFn = (user: User | null): string => {
    return user ? `${user.firstName} ${user.lastName} (${user.email})` : '';
  }

  onAdminSelected(event: MatAutocompleteSelectedEvent): void {
    const user = event.option.value as User;
    this.orgForm.get('adminUserId')?.setValue(user.id);
  }

  onSubmit(): void {
    if (this.orgForm.invalid) return;

    this.submitting = true;
    const request = this.isEditMode
      ? this.apiService.updateOrganization(this.orgId!, this.orgForm.value)
      : this.apiService.createOrganization(this.orgForm.value);

    request.subscribe({
      next: () => {
        this.notificationService.success(
          this.isEditMode ? 'Organisation mise à jour' : 'Organisation créée'
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Une erreur est survenue');
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

