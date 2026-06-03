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
    phone?: string;
    organization?: string;
    preferences?: any;
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
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
            .pipe(
                tap(response => {
                    this.setSession(response);
                })
            );
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/auth/register`, userData);
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

    updateCurrentUser(userData: Partial<User>): void {
        const currentUser = this.currentUserValue;
        if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            localStorage.setItem('current_user', JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
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
