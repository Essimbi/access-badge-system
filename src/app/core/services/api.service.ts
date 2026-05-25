import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, throwError, map, switchMap, take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_ORGANIZATIONS, MOCK_EVENTS, MOCK_STATS, MOCK_USERS, MOCK_ENROLLMENTS, MOCK_GATES, MOCK_BADGE_CATEGORIES, MOCK_BADGE_TEMPLATES } from '../mocks/mock-data';
import { User } from '../models/user.model';

import { AuthService } from './auth.service';
import { MockStoreService, EventRecord, EnrollmentRecord } from './mock-store.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private mockStore: MockStoreService
    ) { }

    hasRole(role: string): boolean {
        return this.authService.hasRole(role);
    }

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
        if (this.authService.hasRole('super_admin')) {
            return this.get<any[]>('/admin/organizations', params).pipe(
                map(orgs => orgs.map(org => this.mapOrganization(org)))
            );
        }
        return this.get<any[]>('/organizations/my-organizations', params).pipe(
            map(orgs => orgs.map(org => this.mapOrganization(org)))
        );
    }

    getOrganization(id: string | number): Observable<any> {
        return this.get<any>(`/organizations/${id}`).pipe(
            map(org => this.mapOrganization(org))
        );
    }

    createOrganization(data: any): Observable<any> {
        const payload = {
            name: data.name,
            email: data.email,
            description: data.description,
            phone: data.phone,
            address: data.address,
            logo_url: data.logoUrl,
            owner_id: data.adminUserId,
            max_events_limit: 100 // Default value
        };
        if (this.authService.hasRole('super_admin')) {
            return this.post('/admin/organizations', payload).pipe(
                map(org => this.mapOrganization(org))
            );
        }
        return this.post('/organizations', payload).pipe(
            map(org => this.mapOrganization(org))
        );
    }

    updateOrganization(id: string | number, data: any): Observable<any> {
        const payload: any = {};
        if (data.name !== undefined) payload.name = data.name;
        if (data.description !== undefined) payload.description = data.description;
        if (data.email !== undefined) payload.email = data.email;
        if (data.phone !== undefined) payload.phone = data.phone;
        if (data.address !== undefined) payload.address = data.address;
        if (data.logoUrl !== undefined) payload.logo_url = data.logoUrl;
        if (data.adminUserId !== undefined) payload.owner_id = data.adminUserId;
        if (data.status !== undefined) payload.status = data.status;
        
        return this.put<any>(`/organizations/${id}`, payload).pipe(
            map(org => this.mapOrganization(org))
        );
    }

    updateOrganizationStatus(id: string | number, status: string): Observable<any> {
        return this.http.patch<any>(`${this.baseUrl}/admin/organizations/${id}/status`, { status }).pipe(
            map(org => this.mapOrganization(org))
        );
    }

    uploadLogo(file: File): Observable<{ url: string, filename: string }> {
        const formData = new FormData();
        formData.append('logo', file);
        return this.http.post<{ url: string, filename: string }>(`${this.baseUrl}/upload/logo`, formData);
    }

    private mapOrganization(org: any): any {
        if (!org) return null;
        return {
            ...org,
            logoUrl: org.logo_url,
            adminUserId: org.owner_id,
            is_active: org.status === 'active',
            eventCount: org.event_count || 0,
            adminUser: org.owner ? {
                id: org.owner.id,
                firstName: org.owner.first_name,
                lastName: org.owner.last_name,
                email: org.owner.email
            } : (org.adminUser || null)
        };
    }

    deleteOrganization(id: string | number): Observable<any> {
        if (this.authService.hasRole('super_admin')) {
            return this.delete(`/admin/organizations/${id}`);
        }
        return this.delete(`/organizations/${id}`);
    }

    getOrganizationMembers(orgId: string | number): Observable<any[]> {
        return this.get<any[]>(`/organizations/${orgId}/members`);
    }

    addOrganizationMember(orgId: string | number, userId: string | number, role: string): Observable<any> {
        return this.post('/organizations/add-user', { org_id: orgId, user_id: userId, role });
    }

    removeOrganizationMember(orgId: string | number, userId: string | number): Observable<any> {
        return this.post('/organizations/remove-user', { org_id: orgId, user_id: userId });
    }

    getOrganizationActivities(orgId: string | number): Observable<any[]> {
        return this.get<any[]>(`/organizations/${orgId}/activities`);
    }

    getRecentActivities(): Observable<any[]> {
        const user = this.authService.currentUserValue;
        if (user && user.organization_id && this.authService.hasRole('admin')) {
            return this.getOrganizationActivities(user.organization_id);
        }
        // Global activities for Super Admin
        const globalActivities = [
            { id: 101, type: 'system', message: 'Backup système effectué', user: 'System', date: new Date() },
            { id: 102, type: 'security', message: 'Nouvelle IP détectée', user: 'Security Bot', date: new Date(Date.now() - 1800000) },
            { id: 103, type: 'user', message: 'Nouveau Super Admin ajouté', user: 'Super Admin', date: new Date(Date.now() - 7200000) }
        ];
        return of(globalActivities).pipe(delay(500));
    }

    // Events
    getEvents(params?: any): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/events`, { params }).pipe(
            map(events => {
                const now = new Date();
                return events.map(event => {
                    // Force dynamic status based on dates
                    const startDate = new Date(event.date);
                    // Use a 2-hour default duration if end_date is missing, otherwise use end_date
                    const endDate = event.end_date ? new Date(event.end_date) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
                    
                    let dynamicStatus = event.status;
                    if (now < startDate) {
                        dynamicStatus = 'upcoming';
                    } else if (now >= startDate && now <= endDate) {
                        dynamicStatus = 'ongoing';
                    } else {
                        dynamicStatus = 'completed';
                    }
                    
                    return { ...event, status: dynamicStatus };
                });
            })
        );
    }

    getEvent(id: number | string): Observable<any> {
        return this.get<any>(`/events/${id}`);
    }

    createEvent(data: any): Observable<any> {
        const payload = {
            title: data.title,
            description: data.description,
            start_date: data.date,
            end_date: data.endDate,
            location: data.location,
            status: data.status,
            type: data.type,
            org_id: data.organization_id,
            max_participants: data.maxParticipants || data.max_participants
        };
        return this.post<any>('/events', payload);
    }

    updateEvent(id: number | string, data: any): Observable<any> {
        const payload = {
            title: data.title,
            description: data.description,
            start_date: data.date,
            end_date: data.endDate,
            location: data.location,
            status: data.status,
            type: data.type,
            org_id: data.organization_id,
            max_participants: data.maxParticipants || data.max_participants
        };
        return this.put<any>(`/events/${id}`, payload);
    }

    deleteEvent(id: number | string): Observable<any> {
        return this.delete<any>(`/events/${id}`);
    }

    publishEvent(id: number): Observable<any> {
        return this.post(`/events/${id}/publish`, {});
    }

    // Enrollments
    getEnrollments(params?: any): Observable<any[]> {
        return this.mockStore.getEnrollments$().pipe(
            take(1),
            switchMap((enrollments: EnrollmentRecord[]) =>
                this.mockStore.getEvents$().pipe(
                    take(1),
                    map((events: EventRecord[]) => {
                        const authUser = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
                        let filtered = [...enrollments];

                        if (authUser && authUser.organization_id) {
                            const orgEventIds = events
                                .filter(e => e.organization_id === authUser.organization_id)
                                .map(e => e.id);
                            filtered = filtered.filter(e => orgEventIds.includes(e.eventId));
                        }

                        if (params?.eventId) {
                            filtered = filtered.filter(e => e.eventId === Number(params.eventId));
                        }

                        if (params?.status) {
                            filtered = filtered.filter(e => e.status === params.status);
                        }

                        return filtered;
                    })
                )
            ),
            delay(300)
        );
    }

    getMyEnrollments(): Observable<any> {
        return this.get<any>('/badges/my-badges');
    }

    getEventEnrollments(eventId: string | number): Observable<any[]> {
        return this.get<any[]>(`/badges/event/${eventId}`);
    }

    printBadges(eventId: string | number): Observable<any> {
        return this.http.get(`${this.baseUrl}/badges/event/${eventId}/bulk-pdf`, { responseType: 'blob' }).pipe(
            map(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `badges-event-${eventId}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
                return { success: true };
            })
        );
    }

    sendBadgeEmail(badgeId: string | number): Observable<any> {
        return this.get<any>(`/badges/${badgeId}/email`);
    }

    downloadParticipantBadge(badgeId: string | number): Observable<any> {
        return this.http.get(`${this.baseUrl}/badges/${badgeId}/pdf`, { responseType: 'blob' }).pipe(
            map(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `badge-${badgeId}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
                return { success: true };
            })
        );
    }

    createEnrollment(data: any): Observable<any> {
        // In the backend, enrolling is creating a badge
        // data usually contains eventId
        return this.post(`/badges/enroll/${data.eventId}`, data);
    }

    approveEnrollment(id: number): Observable<any> {
        return this.mockStore.approveEnrollment(id).pipe(delay(200));
    }

    rejectEnrollment(id: number): Observable<any> {
        return this.mockStore.rejectEnrollment(id).pipe(delay(200));
    }

    deleteEnrollment(id: number): Observable<any> {
        return this.mockStore.deleteEnrollment(id).pipe(delay(200));
    }

    getEnrollmentById(id: number): Observable<any> {
        return this.mockStore.getEnrollmentById$(id).pipe(
            take(1),
            map(enrollment => enrollment ? { ...enrollment, userEmail: 'user@example.com' } : null),
            delay(200)
        );
    }

    // Access Gates
    getAccessGates(): Observable<any[]> {
        const user = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
        let gates = MOCK_GATES;
        if (user && user.organization_id) {
            gates = gates.filter(g => g.organizationId === user.organization_id);
        }
        return of(gates).pipe(delay(500));
    }

    updateGateSettings(id: number, settings: any): Observable<any> {
        return of({ success: true, id, settings }).pipe(delay(500));
    }

    // Badges
    getBadges(params?: any): Observable<any> {
        return this.get('/badges', params);
    }

    getMyBadges(): Observable<any> {
        return this.get('/badges/my-badges');
    }

    enrollEventBadge(eventId: number, category: string = 'Participant'): Observable<any> {
        return this.post(`/badges/enroll/${eventId}`, { event_id: eventId, category });
    }

    unenrollEventBadge(eventId: number): Observable<any> {
        return this.delete(`/badges/enroll/${eventId}`);
    }

    downloadBadgePDF(id: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/badges/${id}/pdf`, {
            responseType: 'blob'
        });
    }

    getBadgeCategories(): Observable<any[]> {
        return this.get<any[]>('/badge-designer/categories');
    }

    createBadgeCategory(data: any): Observable<any> {
        return this.post('/badge-designer/categories', data);
    }

    updateBadgeCategory(id: number, data: any): Observable<any> {
        return this.put(`/badge-designer/categories/${id}`, data);
    }

    getBadgeTemplates(organizationId?: string | number): Observable<any[]> {
        let params = new HttpParams();
        if (organizationId) {
            params = params.set('orgId', organizationId.toString());
        }
        return this.get<any[]>('/badge-designer/templates', params);
    }

    getBadgeTemplateById(id: string | number): Observable<any> {
        return this.get<any>(`/badge-designer/templates/${id}`);
    }

    createBadgeTemplate(data: any): Observable<any> {
        return this.post('/badge-designer/templates', data);
    }

    updateBadgeTemplate(id: string | number, data: any): Observable<any> {
        return this.put(`/badge-designer/templates/${id}`, data);
    }

    deleteBadgeTemplate(id: string | number): Observable<any> {
        return this.delete(`/badge-designer/templates/${id}`);
    }

    generateBadgePDF(data: any): Observable<Blob> {
        return this.http.post(`${this.baseUrl}/badge-designer/generate-preview`, data, {
            responseType: 'blob'
        });
    }

    // Access Logs
    validateQRCode(qrData: string, accessType: string): Observable<any> {
        // Mock QR code validation
        const mockParticipants = [
            { firstName: 'Jean', lastName: 'Dupont', eventName: 'Conférence Innovation 2026', badgeCategory: 'VIP' },
            { firstName: 'Marie', lastName: 'Martin', eventName: 'Workshop Angular 18', badgeCategory: 'Exposant' },
            { firstName: 'Pierre', lastName: 'Bernard', eventName: 'Sommet Tech Africa', badgeCategory: 'Visiteur' }
        ];

        const randomParticipant = mockParticipants[Math.floor(Math.random() * mockParticipants.length)];

        if (Math.random() > 0.95) {
            return throwError(() => ({ error: { message: 'Badge expiré ou invalide' } })).pipe(delay(500));
        }

        return of({
            ...randomParticipant,
            timestamp: new Date(),
            accessType
        }).pipe(delay(800));
    }

    getAccessLogs(params?: any): Observable<any[]> {
        const mockLogs = [];
        const mockNames = [
            { first: 'Jean', last: 'Dupont' },
            { first: 'Marie', last: 'Martin' },
            { first: 'Pierre', last: 'Bernard' },
            { first: 'Sophie', last: 'Leclerc' },
            { first: 'Luc', last: 'Moreau' }
        ];
        const mockEvents = ['Conférence Innovation 2026', 'Workshop Angular 18', 'Sommet Tech Africa'];
        const mockCategories = ['VIP', 'Exposant', 'Visiteur'];
        const mockGates = ['GATE-001', 'GATE-002', 'MOBILE-045'];

        for (let i = 0; i < 20; i++) {
            const name = mockNames[Math.floor(Math.random() * mockNames.length)];
            mockLogs.push({
                id: i + 1,
                firstName: name.first,
                lastName: name.last,
                userId: Math.floor(Math.random() * 100) + 1,
                eventName: mockEvents[Math.floor(Math.random() * mockEvents.length)],
                eventId: Math.floor(Math.random() * 10) + 1,
                badgeCategory: mockCategories[Math.floor(Math.random() * mockCategories.length)],
                accessType: Math.random() > 0.5 ? 'entry' : 'exit',
                timestamp: new Date(Date.now() - Math.random() * 86400000),
                gateId: Math.floor(Math.random() * 3) + 1,
                gateName: mockGates[Math.floor(Math.random() * mockGates.length)],
                status: Math.random() > 0.05 ? 'success' : 'error',
                errorMessage: Math.random() > 0.95 ? 'Badge expiré' : undefined
            });
        }

        return of(mockLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())).pipe(delay(500));
    }

    getEventAccessLogs(eventId: number): Observable<any> {
        return this.get(`/access-logs/event/${eventId}`);
    }

    // Statistics
    getDashboardStats(): Observable<any> {
        if (this.authService.hasRole('super_admin')) {
            return this.get<any>('/admin/platform-stats');
        }
        const user = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
        if (user && user.organization_id) {
            // Admin Organization Stats
            return this.get<any>(`/stats/org/${user.organization_id}`);
        }
        // Fallback
        return this.get<any>('/stats/dashboard');
    }

    getOrganizationStats(id: string | number): Observable<any> {
        return this.get<any>(`/stats/org/${id}`);
    }

    getEventStats(id: number): Observable<any> {
        return of({}).pipe(delay(500));
    }

    getParticipantStats(userId: number): Observable<any> {
        return this.get(`/statistics/participant/${userId}`);
    }

    // Users
    getUsers(params?: any): Observable<any[]> {
        if (this.authService.hasRole('super_admin')) {
            return this.get<any[]>('/admin/users/org-admins', params).pipe(
                map(users => users.map(u => ({
                    ...u,
                    firstName: u.first_name || u.firstName,
                    lastName: u.last_name || u.lastName
                })))
            );
        }
        const user = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
        let users = MOCK_USERS;
        if (user && user.organization_id) {
            users = users.filter(u => u.organization_id === user.organization_id);
        }
        return of(users).pipe(delay(500));
    }

    assignRole(data: any): Observable<any> {
        return this.post('/admin/assign-role', data);
    }

    createUser(data: any): Observable<any> {
        const payload = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            role: data.role,
            password: data.password || 'Mamilo2026!',
            is_active: data.is_active !== undefined ? data.is_active : true
        };
        if (this.authService.hasRole('super_admin')) {
            return this.post('/admin/users', payload);
        }
        return of({ ...data, id: Math.floor(Math.random() * 1000) }).pipe(delay(500));
    }

    getUserById(id: string | number): Observable<User> {
        if (this.authService.hasRole('super_admin')) {
            return this.get<any>(`/admin/users/${id}`).pipe(
                map(u => ({
                    ...u,
                    firstName: u.first_name,
                    lastName: u.last_name
                }))
            );
        }
        
        const user = MOCK_USERS.find(u => u.id == id);
        if (!user) return throwError(() => new Error('Utilisateur non trouvé'));
        return of(user).pipe(delay(300));
    }

    getCurrentUser(): Observable<any> {
        return of(MOCK_USERS[0]).pipe(delay(500));
    }

    updateProfile(data: any): Observable<any> {
        return this.put('/users/me', data);
    }

    updateUser(id: string | number, data: any): Observable<any> {
        let payload: any = { ...data };
        if (data.firstName) payload.first_name = data.firstName;
        if (data.lastName) payload.last_name = data.lastName;
        
        if (this.authService.hasRole('super_admin')) {
            return this.put(`/admin/users/${id}`, payload);
        }
        return of({ ...data, id }).pipe(delay(500));
    }

    deleteUser(id: string | number): Observable<any> {
        if (this.authService.hasRole('super_admin')) {
            return this.delete(`/admin/users/${id}`);
        }
        return of({ success: true }).pipe(delay(500));
    }
}
