import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-enrollment-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatChipsModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './enrollment-detail.html',
    styleUrl: './enrollment-detail.scss'
})
export class EnrollmentDetailComponent implements OnInit {
    enrollment: any = null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadEnrollment(+id);
        }
    }

    loadEnrollment(id: number): void {
        this.loading = true;
        this.apiService.getEnrollmentById(id).subscribe({
            next: (data) => {
                this.enrollment = data;
                this.loading = false;
            },
            error: () => {
                this.notificationService.error('Erreur lors du chargement des détails de l\'inscription');
                this.loading = false;
            }
        });
    }

    updateStatus(status: string): void {
        this.enrollment.status = status;
        this.notificationService.success(`Statut mis à jour : ${status}`);
    }
}
