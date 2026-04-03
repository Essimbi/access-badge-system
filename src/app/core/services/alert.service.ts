import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  constructor() {
    this.generateMockAlerts();
  }

  addAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'read'>): void {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date(),
      read: false
    };

    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([newAlert, ...currentAlerts]);
  }

  markAsRead(alertId: string): void {
    const alerts = this.alertsSubject.value.map(a =>
      a.id === alertId ? { ...a, read: true } : a
    );
    this.alertsSubject.next(alerts);
  }

  clearAlert(alertId: string): void {
    const alerts = this.alertsSubject.value.filter(a => a.id !== alertId);
    this.alertsSubject.next(alerts);
  }

  clearAllAlerts(): void {
    this.alertsSubject.next([]);
  }

  getUnreadCount(): number {
    return this.alertsSubject.value.filter(a => !a.read).length;
  }

  private generateMockAlerts(): void {
    const mockAlerts: Alert[] = [
      {
        id: 'alert-1',
        type: 'warning',
        title: 'Portail GATE-002 inactif',
        message: 'Le portail Zone VIP n\'a pas enregistré d\'activité depuis 30 minutes',
        timestamp: new Date(Date.now() - 1800000),
        read: false
      },
      {
        id: 'alert-2',
        type: 'error',
        title: 'Badge expiré détecté',
        message: 'Un badge expiré a été scanné à 14:35 - Participant: Jean Dupont',
        timestamp: new Date(Date.now() - 3600000),
        read: false
      },
      {
        id: 'alert-3',
        type: 'info',
        title: 'Événement en cours',
        message: 'Conférence Innovation 2026 a commencé - 45 participants présents',
        timestamp: new Date(Date.now() - 7200000),
        read: true
      }
    ];

    this.alertsSubject.next(mockAlerts);
  }
}
