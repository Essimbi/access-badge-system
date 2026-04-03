import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiService } from '../../../core/services/api.service';

@Component({
    selector: 'app-statistics-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatTabsModule
    ],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class StatisticsDashboardComponent implements OnInit {
    stats = {
        totalRevenue: '124 500 €',
        activeUsers: 842,
        orgsGrowth: '+12%',
        eventsThisMonth: 28
    };

    // Mock data for simple bar chart simulation
    monthlyData = [
        { month: 'Jan', value: 45 },
        { month: 'Feb', value: 52 },
        { month: 'Mar', value: 38 },
        { month: 'Apr', value: 65 },
        { month: 'May', value: 48 },
        { month: 'Jun', value: 72 },
        { month: 'Jul', value: 85 },
        { month: 'Aug', value: 60 },
        { month: 'Sep', value: 45 },
        { month: 'Oct', value: 78 },
        { month: 'Nov', value: 92 },
        { month: 'Dec', value: 88 }
    ];

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.apiService.getDashboardStats().subscribe({
            next: (data) => {
                this.stats = {
                    totalRevenue: '124 500 €', // Static for now, as API only provides platform stats
                    activeUsers: data.totalUsers !== undefined ? data.totalUsers : 842,
                    orgsGrowth: `+${data.activeOrganizations || 12}%`,
                    eventsThisMonth: data.totalEvents !== undefined ? data.totalEvents : 28
                };
            },
            error: (err) => console.error('Dashboard Stats Error:', err)
        });
    }
}
