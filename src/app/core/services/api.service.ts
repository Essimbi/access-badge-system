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
            return this.get<any[]>('/admin/organizations', params);
        }
        return this.get<any[]>('/organizations/my-organizations', params);
    }

    getOrganization(id: number): Observable<any> {
        return this.get<any>(`/organizations/${id}`);
    }

    createOrganization(data: any): Observable<any> {
        if (this.authService.hasRole('super_admin')) {
            return this.post('/admin/organizations', data);
        }
        return this.post('/organizations', data);
    }

    updateOrganization(id: number, data: any): Observable<any> {
        return this.put(`/organizations/${id}`, data);
    }

    updateOrganizationStatus(id: number, status: string): Observable<any> {
        return this.http.patch<any>(`${this.baseUrl}/admin/organizations/${id}/status`, { status });
    }

    deleteOrganization(id: number): Observable<any> {
        return this.delete(`/organizations/${id}`);
    }

    getOrganizationMembers(orgId: number): Observable<any[]> {
        const members = MOCK_USERS.filter(u => u.organization_id === orgId);
        return of(members).pipe(delay(500));
    }

    getOrganizationActivities(orgId: number): Observable<any[]> {
        // In a real app, we would filter by orgId on the backend
        // For mock, we can just return a filtered list if we had one, but here we'll simulate
        const user = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;

        // Ensure admin can only see their own org activities
        if (user && user.organization_id && user.organization_id !== orgId) {
            return throwError(() => new Error('Accès non autorisé'));
        }

        const activities = [
            { id: 1, type: 'create', message: 'Organisation créée', user: 'System', date: new Date() },
            { id: 2, type: 'update', message: 'Paramètres mis à jour', user: 'Admin', date: new Date(Date.now() - 3600000) },
            { id: 3, type: 'member_add', message: 'Nouveau membre ajouté', user: 'Admin', date: new Date(Date.now() - 86400000) }
        ];
        return of(activities).pipe(delay(500));
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
        return this.mockStore.getEvents$().pipe(
            take(1),
            map((events: EventRecord[]) => {
                const authUser = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
                let filtered = [...events];

                if (authUser && authUser.organization_id) {
                    filtered = filtered.filter(e => e.organization_id === authUser.organization_id);
                }

                if (params?.organizationId) {
                    filtered = filtered.filter(e => e.organization_id === Number(params.organizationId));
                }

                if (params?.status) {
                    filtered = filtered.filter(e => e.status === params.status);
                }

                return filtered;
            }),
            delay(300)
        );
    }

    getEvent(id: number): Observable<any> {
        return this.mockStore.getEventById$(id).pipe(take(1), delay(200));
    }

    createEvent(data: any): Observable<any> {
        const authUser = this.authService.currentUserValue;
        const payload: Omit<EventRecord, 'id'> = {
            title: data.title,
            description: data.description,
            date: data.date ? new Date(data.date) : new Date(),
            location: data.location,
            status: data.status || 'upcoming',
            type: data.type || 'Conference',
            organization_id: data.organization_id || authUser?.organization_id || 1
        };

        return this.mockStore.createEvent(payload).pipe(delay(200));
    }

    updateEvent(id: number, data: any): Observable<any> {
        const patch: Partial<EventRecord> = {
            title: data.title,
            description: data.description,
            date: data.date ? new Date(data.date) : undefined,
            location: data.location,
            status: data.status,
            type: data.type,
            organization_id: data.organization_id
        };
        return this.mockStore.updateEvent(id, patch).pipe(delay(200));
    }

    deleteEvent(id: number): Observable<any> {
        return this.mockStore.deleteEvent(id).pipe(delay(200));
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
        return of(MOCK_ENROLLMENTS.slice(0, 2)).pipe(delay(500));
    }

    getEventEnrollments(eventId: number): Observable<any[]> {
        return this.mockStore.getEnrollments$().pipe(
            take(1),
            map((items: EnrollmentRecord[]) => items.filter(e => e.eventId === eventId)),
            delay(300)
        );
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

    downloadBadgePDF(id: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/badges/${id}/pdf`, {
            responseType: 'blob'
        });
    }

    getBadgeCategories(): Observable<any[]> {
        const user = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
        let categories = MOCK_BADGE_CATEGORIES;
        if (user && user.organization_id) {
            categories = categories.filter(c => c.organizationId === user.organization_id);
        }
        return of(categories).pipe(delay(300));
    }

    createBadgeCategory(data: any): Observable<any> {
        return of({ ...data, id: Date.now() }).pipe(delay(500));
    }

    updateBadgeCategory(id: number, data: any): Observable<any> {
        return of({ ...data, id }).pipe(delay(500));
    }

    getBadgeTemplates(): Observable<any[]> {
        const user = this.authService.hasRole('admin') ? this.authService.currentUserValue : null;
        let templates = MOCK_BADGE_TEMPLATES;
        if (user && user.organization_id) {
            templates = templates.filter(t => t.organizationId === user.organization_id);
        }
        return of(templates).pipe(delay(500));
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
