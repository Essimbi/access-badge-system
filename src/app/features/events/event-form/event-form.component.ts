import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  saving = false;
  isEdit = false;
  eventId: string | number | null = null;

  organizations: any[] = [];
  isSuperAdmin = false;

  statuses = [
    { value: 'upcoming', label: 'À venir' },
    { value: 'ongoing', label: 'En cours' },
    { value: 'completed', label: 'Terminé' }
  ];

  types = ['Conference', 'Workshop', 'Summit', 'Hackathon', 'Meetup'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      endDate: [''],
      location: ['', Validators.required],
      status: ['upcoming', Validators.required],
      type: ['Conference', Validators.required],
      participantLimit: [null, [Validators.min(1)]],
      organization_id: [null]
    });
  }

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.hasRole('super_admin');

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.eventId = id;
    }

    this.loadOrganizations();

    if (this.isEdit && this.eventId) {
      this.loadEvent(this.eventId);
    } else {
      // Default org for admin
      const currentUser = this.authService.currentUserValue;
      if (!this.isSuperAdmin && currentUser?.organization_id) {
        this.form.patchValue({ organization_id: currentUser.organization_id });
      }
    }
  }

  private loadOrganizations(): void {
    if (!this.isSuperAdmin) return;

    this.apiService.getOrganizations().subscribe({
      next: orgs => (this.organizations = orgs),
      error: () => {
        this.organizations = [];
      }
    });
  }

  private loadEvent(id: string | number): void {
    this.loading = true;
    this.apiService.getEvent(id).subscribe({
      next: (event) => {
        if (!event) {
          this.notificationService.error('Événement introuvable');
          this.router.navigate(['/dashboard/events']);
          return;
        }

        this.form.patchValue({
          title: event.title,
          description: event.description,
          date: event.start_date ? new Date(event.start_date) : null,
          endDate: event.end_date ? new Date(event.end_date) : null,
          location: event.location,
          status: event.status,
          type: event.type,
          participantLimit: event.max_participants || null,
          organization_id: event.org_id
        });

        // If admin, lock org to own org
        const currentUser = this.authService.currentUserValue;
        if (!this.isSuperAdmin && currentUser?.organization_id) {
          this.form.patchValue({ organization_id: currentUser.organization_id });
        }

        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement de l\'événement');
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.error('Veuillez remplir les champs requis');
      return;
    }

    const raw = this.form.value;
    const payload = {
      ...raw,
      ...raw,
      date: raw.date ? new Date(raw.date) : new Date(),
      endDate: raw.endDate ? new Date(raw.endDate) : null,
      maxParticipants: raw.participantLimit ? Number(raw.participantLimit) : 500
    };

    // Admin safety: force org
    const currentUser = this.authService.currentUserValue;
    if (!this.isSuperAdmin && currentUser?.organization_id) {
      payload.organization_id = currentUser.organization_id;
    }

    this.saving = true;

    const request$ = this.isEdit && this.eventId
      ? this.apiService.updateEvent(this.eventId, payload)
      : this.apiService.createEvent(payload);

    request$.subscribe({
      next: () => {
        this.notificationService.success(this.isEdit ? 'Événement mis à jour' : 'Événement créé');
        this.router.navigate(['/dashboard/events']);
        this.saving = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors de la sauvegarde');
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/events']);
  }
}
