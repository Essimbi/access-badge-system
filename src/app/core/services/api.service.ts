import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_ORGANIZATIONS, MOCK_EVENTS, MOCK_STATS, MOCK_USERS, MOCK_ENROLLMENTS, MOCK_GATES, MOCK_BADGE_CATEGORIES, MOCK_BADGE_TEMPLATES } from '../mocks/mock-data';
import { User } from '../models/user.model';

import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    // Generic CRUD methods
    get<T>(endpoint: string, params?: any): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
    }

    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
    }

    // Organizations
    getOrganizations(params?: any): Observable<any[]> {
        return of(MOCK_ORGANIZATIONS).pipe(delay(500));
    }

    getOrganization(id: number): Observable<any> {
        const org = MOCK_ORGANIZATIONS.find(o => o.id === id);
        return of(org).pipe(delay(500));
    }

    createOrganization(data: any): Observable<any> {
        return this.post('/organizations', data);
    }

    updateOrganization(id: number, data: any): Observable<any> {
        return this.put(`/organizations/${id}`, data);
    }

    deleteOrganization(id: number): Observable<any> {
        return this.delete(`/organizations/${id}`);
    }

    getOrganizationMembers(orgId: number): Observable<any[]> {
        const members = MOCK_USERS.filter(u => u.organization_id === orgId);
        return of(members).pipe(delay(500));
    }

    getOrganizationActivities(orgId: number): Observable<any[]> {
        const activities = [
            { id: 1, type: 'create', message: 'Organisation créée', user: 'System', date: new Date() },
            { id: 2, type: 'update', message: 'Paramètres mis à jour', user: 'Admin', date: new Date(Date.now() - 3600000) },
            { id: 3, type: 'member_add', message: 'Nouveau membre ajouté', user: 'Admin', date: new Date(Date.now() - 86400000) }
        ];
        return of(activities).pipe(delay(500));
    }

    // Events
    getEvents(params?: any): Observable<any[]> {
        const user = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
        let events = MOCK_EVENTS;
        if (user && user.organization_id) {
            events = events.filter(e => e.organization_id === user.organization_id);
        }
        return of(events).pipe(delay(500));
    }

    getEvent(id: number): Observable<any> {
        const event = MOCK_EVENTS.find(e => e.id === id);
        return of(event).pipe(delay(500));
    }

    createEvent(data: any): Observable<any> {
        return this.post('/events', data);
    }

    updateEvent(id: number, data: any): Observable<any> {
        return this.put(`/events/${id}`, data);
    }

    deleteEvent(id: number): Observable<any> {
        return of({ success: true }).pipe(delay(500));
    }

    publishEvent(id: number): Observable<any> {
        return this.post(`/events/${id}/publish`, {});
    }

    // Enrollments
    getEnrollments(params?: any): Observable<any[]> {
        const user = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
        let enrollments = MOCK_ENROLLMENTS;
        if (user && user.organization_id) {
            // Filter enrollments by events belonging to the organization
            const orgEventIds = MOCK_EVENTS
                .filter(e => e.organization_id === user.organization_id)
                .map(e => e.id);
            enrollments = enrollments.filter(e => orgEventIds.includes(e.eventId));
        }
        return of(enrollments).pipe(delay(500));
    }

    getMyEnrollments(): Observable<any> {
        return of(MOCK_ENROLLMENTS.slice(0, 2)).pipe(delay(500));
    }

    getEventEnrollments(eventId: number): Observable<any[]> {
        const enrollments = MOCK_ENROLLMENTS.filter(e => e.eventId === eventId);
        return of(enrollments).pipe(delay(600));
    }

    printBadges(eventId: number, enrollmentIds?: number[]): Observable<any> {
        // Simulate PDF generation delay
        return of({ success: true, message: 'Génération du PDF en cours...' }).pipe(delay(2000));
    }

    downloadParticipantBadge(enrollmentId: number): Observable<any> {
        return of({ success: true }).pipe(delay(1000));
    }

    createEnrollment(data: any): Observable<any> {
        return this.post('/enrollments', data);
    }

    approveEnrollment(id: number): Observable<any> {
        return this.post(`/enrollments/${id}/approve`, {});
    }

    rejectEnrollment(id: number): Observable<any> {
        return this.post(`/enrollments/${id}/reject`, {});
    }

    deleteEnrollment(id: number): Observable<any> {
        return of({ success: true }).pipe(delay(500));
    }

    getEnrollmentById(id: number): Observable<any> {
        const enrollment = MOCK_ENROLLMENTS.find(e => e.id === id);
        return of(enrollment ? { ...enrollment, userEmail: 'user@example.com' } : null).pipe(delay(400));
    }

    // Access Gates
    getAccessGates(): Observable<any[]> {
        return of(MOCK_GATES).pipe(delay(500));
    }

    updateGateSettings(id: number, settings: any): Observable<any> {
        return of({ success: true, id, settings }).pipe(delay(500));
    }

    // Badges
    getBadges(params?: any): Observable<any> {
        return this.get('/badges', params);
    }

    downloadBadgePDF(id: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/badges/${id}/pdf`, {
            responseType: 'blob'
        });
    }

    getBadgeCategories(): Observable<any[]> {
        return of(MOCK_BADGE_CATEGORIES).pipe(delay(300));
    }

    createBadgeCategory(data: any): Observable<any> {
        return of({ ...data, id: Date.now() }).pipe(delay(500));
    }

    updateBadgeCategory(id: number, data: any): Observable<any> {
        return of({ ...data, id }).pipe(delay(500));
    }

    getBadgeTemplates(): Observable<any[]> {
        return of(MOCK_BADGE_TEMPLATES).pipe(delay(500));
    }

    getBadgeTemplateById(id: number): Observable<any> {
        const template = MOCK_BADGE_TEMPLATES.find(t => t.id === id);
        return of(template).pipe(delay(400));
    }

    createBadgeTemplate(data: any): Observable<any> {
        return of({ ...data, id: Date.now() }).pipe(delay(500));
    }

    updateBadgeTemplate(id: number, data: any): Observable<any> {
        return of({ ...data, id }).pipe(delay(500));
    }

    deleteBadgeTemplate(id: number): Observable<any> {
        return of({ success: true }).pipe(delay(500));
    }

    // Access Logs
    validateQRCode(qrData: string, accessType: string): Observable<any> {
        return this.post('/access-logs', {
            qr_code_data: qrData,
            access_type: accessType
        });
    }

    getAccessLogs(params?: any): Observable<any> {
        return this.get('/access-logs', params);
    }

    getEventAccessLogs(eventId: number): Observable<any> {
        return this.get(`/access-logs/event/${eventId}`);
    }

    // Statistics
    getDashboardStats(): Observable<any> {
        const user = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
        if (user && user.organization_id) {
            return of(MOCK_STATS.organization).pipe(delay(500));
        }
        return of(MOCK_STATS.dashboard).pipe(delay(500));
    }

    getOrganizationStats(id: number): Observable<any> {
        return of(MOCK_STATS.organization).pipe(delay(500));
    }

    getEventStats(id: number): Observable<any> {
        return of({}).pipe(delay(500));
    }

    getParticipantStats(userId: number): Observable<any> {
        return this.get(`/statistics/participant/${userId}`);
    }

    // Users
    getUsers(params?: any): Observable<any[]> {
        const user = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
        let users = MOCK_USERS;
        if (user && user.organization_id) {
            users = users.filter(u => u.organization_id === user.organization_id);
        }
        return of(users).pipe(delay(500));
    }

    createUser(data: any): Observable<any> {
        return of({ ...data, id: Math.floor(Math.random() * 1000) }).pipe(delay(500));
    }

    getUserById(id: number): Observable<User> {
        const user = MOCK_USERS.find(u => u.id === id);
        if (!user) return throwError(() => new Error('Utilisateur non trouvé'));
        return of(user).pipe(delay(300));
    }

    getCurrentUser(): Observable<any> {
        return of(MOCK_USERS[0]).pipe(delay(500));
    }

    updateProfile(data: any): Observable<any> {
        return this.put('/users/me', data);
    }

    updateUser(id: number, data: any): Observable<any> {
        return of({ ...data, id }).pipe(delay(500));
    }

    deleteUser(id: number): Observable<any> {
        return of({ success: true }).pipe(delay(500));
    }
}
