import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AlertService, Alert } from '../../../core/services/alert.service';

@Component({
  selector: 'app-alerts-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './alerts-panel.component.html',
  styleUrl: './alerts-panel.component.scss'
})
export class AlertsPanelComponent implements OnInit {
  alerts: Alert[] = [];
  unreadCount = 0;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
      this.unreadCount = this.alertService.getUnreadCount();
    });
  }

  markAsRead(alert: Alert): void {
    this.alertService.markAsRead(alert.id);
  }

  clearAlert(alert: Alert): void {
    this.alertService.clearAlert(alert.id);
  }

  clearAllAlerts(): void {
    this.alertService.clearAllAlerts();
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'check_circle';
      default:
        return 'notifications';
    }
  }

  getAlertColor(type: string): string {
    switch (type) {
      case 'error':
        return 'warn';
      case 'warning':
        return 'accent';
      case 'info':
        return 'primary';
      case 'success':
        return 'primary';
      default:
        return 'primary';
    }
  }
}
