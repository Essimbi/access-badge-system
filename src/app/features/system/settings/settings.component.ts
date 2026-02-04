import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-system-settings',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatDividerModule
    ],
    templateUrl: './settings.html',
    styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
    settings = {
        appName: '3CM Event Solution',
        supportEmail: 'support@3cm.com',
        enableRegistration: true,
        maintenanceMode: false,
        maxUploadSize: 5,
        smtpHost: 'smtp.3cm.com',
        smtpPort: 587
    };

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void { }

    saveSettings(): void {
        this.notificationService.success('Paramètres système mis à jour (Simulation)');
    }
}
