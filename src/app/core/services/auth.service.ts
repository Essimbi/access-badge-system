import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, delay } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

export interface User {
    userId: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    organization_id?: number;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUserFromStorage();
    }

    login(email: string, password: string): Observable<LoginResponse> {
        const mockUsers: { [key: string]: User } = {
            'superadmin@test.com': {
                userId: 1,
                email: 'superadmin@test.com',
                role: 'super_admin',
                firstName: 'Super',
                lastName: 'Admin'
            },
            'admin@test.com': {
                userId: 2,
                email: 'admin@test.com',
                role: 'admin',
                firstName: 'Alice',
                lastName: 'Admin',
                organization_id: 1
            },
            'control@test.com': {
                userId: 3,
                email: 'control@test.com',
                role: 'controller',
                firstName: 'Benoit',
                lastName: 'Controleur',
                organization_id: 1
            },
            'user@test.com': {
                userId: 4,
                email: 'user@test.com',
                role: 'participant',
                firstName: 'Jean',
                lastName: 'Particulier'
            }
        };

        return new Observable<LoginResponse>(observer => {
            setTimeout(() => {
                const user = mockUsers[email];
                if (user && password === 'password123') {
                    // Generate a dummy token that jwt-decode can handle (header.payload.signature)
                    // The payload needs an 'exp' field for isAuthenticated check
                    const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24); // 24h
                    const payload = btoa(JSON.stringify({ exp, ...user }));
                    const dummyToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.signature`;

                    const response: LoginResponse = {
                        token: dummyToken,
                        refreshToken: 'mock-refresh-token',
                        user: user
                    };
                    this.setSession(response);
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error({ error: { message: 'Identifiants invalides (Simulation)' } });
                }
            }, 500);
        });
    }

    register(userData: any): Observable<any> {
        return of({ message: 'Compte créé avec succès (Simulation)' }).pipe(delay(500));
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_user');
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    private setSession(authResult: LoginResponse): void {
        localStorage.setItem('access_token', authResult.token);
        localStorage.setItem('refresh_token', authResult.refreshToken);
        localStorage.setItem('current_user', JSON.stringify(authResult.user));
        this.currentUserSubject.next(authResult.user);
    }

    private loadUserFromStorage(): void {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
            try {
                this.currentUserSubject.next(JSON.parse(userStr));
            } catch (e) {
                localStorage.removeItem('current_user');
            }
        }
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    hasRole(role: string): boolean {
        const user = this.currentUserSubject.value;
        return user?.role === role;
    }

    hasAnyRole(roles: string[]): boolean {
        const user = this.currentUserSubject.value;
        return user ? roles.includes(user.role) : false;
    }
}
