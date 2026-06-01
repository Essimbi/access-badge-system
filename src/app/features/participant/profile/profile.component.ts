import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatDividerModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    RouterModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  preferencesForm: FormGroup;

  currentUser: any = null;
  loading = false;
  editingProfile = false;
  editingPassword = false;
  editingPreferences = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      organization: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.preferencesForm = this.fb.group({
      emailNotifications: [true],
      pushNotifications: [true],
      eventReminders: [true],
      newsletter: [false],
      theme: ['light']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          organization: user.organization || ''
        });
      }
      this.loading = false;
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.notificationService.error('Veuillez remplir tous les champs requis');
      return;
    }

    this.loading = true;
    this.apiService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.notificationService.success('Profil mis à jour avec succès');
        this.editingProfile = false;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors de la mise à jour du profil');
        this.loading = false;
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.notificationService.error('Veuillez remplir tous les champs correctement');
      return;
    }

    this.loading = true;
    // Simulation du changement de mot de passe
    setTimeout(() => {
      this.notificationService.success('Mot de passe changé avec succès');
      this.passwordForm.reset();
      this.editingPassword = false;
      this.loading = false;
    }, 1000);
  }

  savePreferences(): void {
    // Simulation de la sauvegarde des préférences en arrière-plan
    setTimeout(() => {
      this.notificationService.success('Préférences mises à jour');
      this.editingPreferences = false;
    }, 500);
  }

  cancelEdit(form: string): void {
    if (form === 'profile') {
      this.editingProfile = false;
      this.loadUserProfile();
    } else if (form === 'password') {
      this.editingPassword = false;
      this.passwordForm.reset();
    } else if (form === 'preferences') {
      this.editingPreferences = false;
    }
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  downloadProfileData(): void {
    const data = {
      user: this.currentUser,
      preferences: this.preferencesForm.value,
      downloadDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile-${this.currentUser.email}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.notificationService.success('Données téléchargées');
  }

  deleteAccount(): void {
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.');
    if (!confirmed) return;

    this.loading = true;
    // Simulation de la suppression du compte
    setTimeout(() => {
      this.notificationService.success('Compte supprimé');
      this.authService.logout();
      this.loading = false;
    }, 1000);
  }
}
