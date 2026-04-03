import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss'
})
export class DashboardHomeComponent implements OnInit {
  currentUser: User | null = null;
  stats: any = {
    totalEvents: 0,
    activeBadges: 0,
    organizations: 0,
    newRequests: 0
  };
  recentEvents: any[] = [];
  activities: any[] = [];
  isController = false;
  isParticipant = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isController = user?.role === 'controller';
      this.isParticipant = user?.role === 'participant';

      // Si c'est un contrôleur ou participant, charger les stats spécifiques
      if (this.isController) {
        this.loadControllerStats();
      } else if (this.isParticipant) {
        this.loadParticipantStats();
      } else {
        this.loadStats();
        this.loadRecentEvents();
      }
    });
  }

  loadRecentEvents(): void {
    this.apiService.getEvents({ limit: 3 }).subscribe(events => {
      this.recentEvents = events.slice(0, 3);
    });
  }

  loadStats(): void {
    // Simulated stats for now, later will call API
    this.stats = {
      totalEvents: 12,
      activeBadges: 450,
      organizations: 5,
      newRequests: 8
    };
  }

  loadControllerStats(): void {
    // Stats pour le contrôleur
    this.stats = {
      totalEvents: 3,
      activeBadges: 0,
      organizations: 1,
      newRequests: 0
    };
  }

  loadParticipantStats(): void {
    // Stats pour le participant
    this.stats = {
      totalEvents: 5,
      activeBadges: 3,
      organizations: 0,
      newRequests: 2
    };
  }
}
