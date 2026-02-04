# MANIFEST FRONTEND - Système de Gestion de Badges d'Événements
**Framework:** Angular 17+  
**UI Library:** Angular Material + Tailwind CSS  
**Pour:** Kiro (Développement Frontend)

---

## 🎯 OBJECTIF DU PROJET

Développer une application web Angular moderne et responsive pour gérer les badges d'accès aux événements avec interfaces différenciées selon les rôles utilisateurs (Super Admin, Admin, Contrôleur, Participant).

---

## 📋 ARCHITECTURE GÉNÉRALE

### Structure du Projet Angular
```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                        # Services, guards, interceptors
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── storage.service.ts
│   │   │   │   └── notification.service.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   └── loading.interceptor.ts
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       ├── organization.model.ts
│   │   │       ├── event.model.ts
│   │   │       ├── badge.model.ts
│   │   │       └── enrollment.model.ts
│   │   ├── shared/                      # Composants partagés
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── footer/
│   │   │   │   ├── loading-spinner/
│   │   │   │   ├── confirmation-dialog/
│   │   │   │   ├── badge-preview/
│   │   │   │   └── qr-scanner/
│   │   │   ├── pipes/
│   │   │   │   ├── date-format.pipe.ts
│   │   │   │   ├── role-translate.pipe.ts
│   │   │   │   └── status-badge.pipe.ts
│   │   │   └── directives/
│   │   │       └── has-role.directive.ts
│   │   ├── features/                    # Modules fonctionnels
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── auth-routing.module.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── super-admin-dashboard/
│   │   │   │   ├── admin-dashboard/
│   │   │   │   ├── controller-dashboard/
│   │   │   │   ├── participant-dashboard/
│   │   │   │   └── dashboard-routing.module.ts
│   │   │   ├── organizations/
│   │   │   │   ├── organization-list/
│   │   │   │   ├── organization-detail/
│   │   │   │   ├── organization-form/
│   │   │   │   └── organizations-routing.module.ts
│   │   │   ├── events/
│   │   │   │   ├── event-list/
│   │   │   │   ├── event-detail/
│   │   │   │   ├── event-form/
│   │   │   │   ├── event-participants/
│   │   │   │   └── events-routing.module.ts
│   │   │   ├── badges/
│   │   │   │   ├── badge-list/
│   │   │   │   ├── badge-designer/         # Éditeur template HTML
│   │   │   │   ├── badge-preview/
│   │   │   │   ├── badge-categories/
│   │   │   │   └── badges-routing.module.ts
│   │   │   ├── enrollments/
│   │   │   │   ├── enrollment-list/
│   │   │   │   ├── enrollment-form/
│   │   │   │   ├── enrollment-approval/
│   │   │   │   └── enrollments-routing.module.ts
│   │   │   ├── access-control/
│   │   │   │   ├── qr-scanner/
│   │   │   │   ├── access-logs/
│   │   │   │   ├── realtime-monitor/
│   │   │   │   └── access-routing.module.ts
│   │   │   ├── statistics/
│   │   │   │   ├── organization-stats/
│   │   │   │   ├── event-stats/
│   │   │   │   ├── participant-stats/
│   │   │   │   └── statistics-routing.module.ts
│   │   │   └── users/
│   │   │       ├── user-list/
│   │   │       ├── user-form/
│   │   │       ├── profile/
│   │   │       └── users-routing.module.ts
│   │   ├── layouts/
│   │   │   ├── main-layout/
│   │   │   ├── auth-layout/
│   │   │   └── dashboard-layout/
│   │   └── app-routing.module.ts
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── i18n/                        # Traductions (optionnel)
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── styles.scss
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 📦 DÉPENDANCES NPM À INSTALLER

```json
{
  "dependencies": {
    "@angular/animations": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/compiler": "^17.0.0",
    "@angular/core": "^17.0.0",
    "@angular/forms": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/platform-browser-dynamic": "^17.0.0",
    "@angular/router": "^17.0.0",
    "@angular/material": "^17.0.0",
    "@angular/cdk": "^17.0.0",
    "rxjs": "^7.8.1",
    "tslib": "^2.6.2",
    "zone.js": "^0.14.2",
    "chart.js": "^4.4.0",
    "ng2-charts": "^5.0.3",
    "@zxing/ngx-scanner": "^17.0.0",
    "ngx-qrcode": "^17.0.0",
    "file-saver": "^2.0.5",
    "jwt-decode": "^4.0.0",
    "moment": "^2.29.4"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.0.0",
    "@angular/cli": "^17.0.0",
    "@angular/compiler-cli": "^17.0.0",
    "typescript": "~5.2.2",
    "tailwindcss": "^3.3.5",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

---

## 🎨 CONFIGURATION TAILWIND CSS

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
        },
        secondary: {
          500: '#ff9800',
          600: '#fb8c00',
        },
        success: '#4caf50',
        warning: '#ff9800',
        danger: '#f44336',
        info: '#2196f3',
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 🔐 SERVICES CORE

### 1. **Auth Service** (auth.service.ts)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { environment } from '../../environments/environment';

interface User {
  userId: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface LoginResponse {
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
      this.currentUserSubject.next(JSON.parse(userStr));
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
```

### 2. **API Service** (api.service.ts)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
  getOrganizations(params?: any): Observable<any> {
    return this.get('/organizations', params);
  }

  getOrganization(id: number): Observable<any> {
    return this.get(`/organizations/${id}`);
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

  // Events
  getEvents(params?: any): Observable<any> {
    return this.get('/events', params);
  }

  getEvent(id: number): Observable<any> {
    return this.get(`/events/${id}`);
  }

  createEvent(data: any): Observable<any> {
    return this.post('/events', data);
  }

  updateEvent(id: number, data: any): Observable<any> {
    return this.put(`/events/${id}`, data);
  }

  deleteEvent(id: number): Observable<any> {
    return this.delete(`/events/${id}`);
  }

  publishEvent(id: number): Observable<any> {
    return this.post(`/events/${id}/publish`, {});
  }

  // Enrollments
  getEnrollments(params?: any): Observable<any> {
    return this.get('/enrollments', params);
  }

  getMyEnrollments(): Observable<any> {
    return this.get('/enrollments/my-enrollments');
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

  // Badges
  getBadges(params?: any): Observable<any> {
    return this.get('/badges', params);
  }

  downloadBadgePDF(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/badges/${id}/pdf`, { 
      responseType: 'blob' 
    });
  }

  getBadgeCategories(): Observable<any> {
    return this.get('/badges/categories');
  }

  getBadgeTemplates(): Observable<any> {
    return this.get('/badges/templates');
  }

  createBadgeTemplate(data: any): Observable<any> {
    return this.post('/badges/templates', data);
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
    return this.get('/statistics/dashboard');
  }

  getOrganizationStats(id: number): Observable<any> {
    return this.get(`/statistics/organization/${id}`);
  }

  getEventStats(id: number): Observable<any> {
    return this.get(`/statistics/event/${id}`);
  }

  getParticipantStats(userId: number): Observable<any> {
    return this.get(`/statistics/participant/${userId}`);
  }

  // Users
  getUsers(params?: any): Observable<any> {
    return this.get('/users', params);
  }

  getCurrentUser(): Observable<any> {
    return this.get('/users/me');
  }

  updateProfile(data: any): Observable<any> {
    return this.put('/users/me', data);
  }
}
```

### 3. **Notification Service** (notification.service.ts)

```typescript
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  error(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  info(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  warning(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-warning'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
```

---

## 🛡️ GUARDS ET INTERCEPTORS

### Auth Guard (auth.guard.ts)

```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && !this.authService.hasAnyRole(requiredRoles)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
```

### Auth Interceptor (auth.interceptor.ts)

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
}
```

### Error Interceptor (error.interceptor.ts)

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.notificationService.error('Session expirée. Veuillez vous reconnecter.');
        } else if (error.status === 403) {
          this.notificationService.error('Accès refusé.');
        } else if (error.status === 500) {
          this.notificationService.error('Erreur serveur. Veuillez réessayer.');
        } else {
          this.notificationService.error(error.error?.message || 'Une erreur est survenue.');
        }
        return throwError(() => error);
      })
    );
  }
}
```

---

## 🎨 INTERFACES UTILISATEUR PAR RÔLE

### 1. **Dashboard Super Admin**

**Composant:** `super-admin-dashboard.component.ts`

**Fonctionnalités:**
- Vue d'ensemble globale (nb organisations, événements, participants)
- Graphiques statistiques:
  - Évolution des inscriptions
  - Distribution par organisation
  - Événements par type
- Liste des organisations récentes
- Actions rapides:
  - Créer organisation
  - Gérer utilisateurs admin
  - Vue logs système

**Template Angular Material:**
```html
<div class="dashboard-container p-6">
  <h1 class="text-3xl font-bold mb-6">Tableau de bord Super Admin</h1>
  
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <mat-card class="stat-card">
      <mat-card-content>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500">Organisations</p>
            <h2 class="text-2xl font-bold">{{ stats?.totalOrganizations }}</h2>
          </div>
          <mat-icon class="text-primary-500">business</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>
    
    <mat-card class="stat-card">
      <mat-card-content>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500">Événements</p>
            <h2 class="text-2xl font-bold">{{ stats?.totalEvents }}</h2>
          </div>
          <mat-icon class="text-success">event</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>
    
    <mat-card class="stat-card">
      <mat-card-content>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500">Participants</p>
            <h2 class="text-2xl font-bold">{{ stats?.totalParticipants }}</h2>
          </div>
          <mat-icon class="text-warning">people</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>
    
    <mat-card class="stat-card">
      <mat-card-content>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500">Badges émis</p>
            <h2 class="text-2xl font-bold">{{ stats?.totalBadgesIssued }}</h2>
          </div>
          <mat-icon class="text-info">badge</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>
  </div>

  <!-- Charts -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Événements par type</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <canvas baseChart [data]="eventTypesChartData" [type]="'doughnut'"></canvas>
      </mat-card-content>
    </mat-card>
    
    <mat-card>
      <mat-card-header>
        <mat-card-title>Inscriptions mensuelles</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <canvas baseChart [data]="enrollmentsChartData" [type]="'line'"></canvas>
      </mat-card-content>
    </mat-card>
  </div>

  <!-- Recent Organizations -->
  <mat-card>
    <mat-card-header>
      <mat-card-title>Organisations récentes</mat-card-title>
      <button mat-raised-button color="primary" routerLink="/organizations/new">
        <mat-icon>add</mat-icon> Nouvelle organisation
      </button>
    </mat-card-header>
    <mat-card-content>
      <table mat-table [dataSource]="recentOrganizations">
        <!-- Columns definition -->
      </table>
    </mat-card-content>
  </mat-card>
</div>
```

### 2. **Dashboard Admin**

**Composant:** `admin-dashboard.component.ts`

**Fonctionnalités:**
- Vue organisations gérées
- Liste événements de ses organisations
- Statistiques par organisation
- Gestion inscriptions en attente
- Actions rapides:
  - Créer événement
  - Approuver inscriptions
  - Gérer badges

**Éléments clés:**
```typescript
export class AdminDashboardComponent implements OnInit {
  organizations: Organization[] = [];
  upcomingEvents: Event[] = [];
  pendingEnrollments: Enrollment[] = [];
  stats: any = {};

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Charger organisations
    this.apiService.getOrganizations().subscribe(data => {
      this.organizations = data;
      // Charger stats pour chaque org
      this.organizations.forEach(org => {
        this.loadOrgStats(org.id);
      });
    });

    // Charger événements à venir
    this.apiService.getEvents({ status: 'upcoming' }).subscribe(data => {
      this.upcomingEvents = data;
    });

    // Charger inscriptions en attente
    this.apiService.getEnrollments({ status: 'pending' }).subscribe(data => {
      this.pendingEnrollments = data;
    });
  }

  approveEnrollment(enrollmentId: number): void {
    this.apiService.approveEnrollment(enrollmentId).subscribe({
      next: () => {
        this.notificationService.success('Inscription approuvée');
        this.loadDashboardData();
      },
      error: () => this.notificationService.error('Erreur lors de l\'approbation')
    });
  }
}
```

### 3. **Dashboard Contrôleur**

**Composant:** `controller-dashboard.component.ts`

**Fonctionnalités:**
- Scanner QR codes (webcam ou upload image)
- Liste des scans récents
- Événements assignés
- Statistiques temps réel:
  - Nombre d'entrées aujourd'hui
  - Nombre de sorties
  - Participants actuellement présents

**Template avec Scanner QR:**
```html
<div class="controller-dashboard p-6">
  <h1 class="text-3xl font-bold mb-6">Contrôle d'accès</h1>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- QR Scanner -->
    <mat-card>
      <mat-card-header>
        <mat-card-title>Scanner Badge</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-button-toggle-group [(ngModel)]="accessType" class="mb-4">
          <mat-button-toggle value="entry">Entrée</mat-button-toggle>
          <mat-button-toggle value="exit">Sortie</mat-button-toggle>
        </mat-button-toggle-group>

        <zxing-scanner 
          [formats]="['QR_CODE']"
          (scanSuccess)="onScanSuccess($event)">
        </zxing-scanner>

        <div *ngIf="lastScan" class="scan-result mt-4 p-4 bg-green-100 rounded">
          <h3 class="font-bold">{{ lastScan.participantName }}</h3>
          <p>Événement: {{ lastScan.eventName }}</p>
          <p>Catégorie: {{ lastScan.badgeCategory }}</p>
          <p class="text-sm text-gray-600">{{ lastScan.timestamp | date:'short' }}</p>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- Recent Scans -->
    <mat-card>
      <mat-card-header>
        <mat-card-title>Scans récents</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          <mat-list-item *ngFor="let scan of recentScans">
            <mat-icon matListItemIcon 
              [class.text-success]="scan.accessType === 'entry'"
              [class.text-warning]="scan.accessType === 'exit'">
              {{ scan.accessType === 'entry' ? 'login' : 'logout' }}
            </mat-icon>
            <div matListItemTitle>{{ scan.participantName }}</div>
            <div matListItemLine>{{ scan.timestamp | date:'short' }}</div>
          </mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    <mat-card>
      <mat-card-content>
        <div class="text-center">
          <mat-icon class="text-4xl text-success">input</mat-icon>
          <h2 class="text-2xl font-bold">{{ todayStats?.entries }}</h2>
          <p class="text-gray-500">Entrées aujourd'hui</p>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-content>
        <div class="text-center">
          <mat-icon class="text-4xl text-warning">output</mat-icon>
          <h2 class="text-2xl font-bold">{{ todayStats?.exits }}</h2>
          <p class="text-gray-500">Sorties aujourd'hui</p>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-content>
        <div class="text-center">
          <mat-icon class="text-4xl text-info">people</mat-icon>
          <h2 class="text-2xl font-bold">{{ todayStats?.currentAttendees }}</h2>
          <p class="text-gray-500">Présents actuellement</p>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
</div>
```

**Logique TypeScript:**
```typescript
export class ControllerDashboardComponent implements OnInit {
  accessType: 'entry' | 'exit' = 'entry';
  lastScan: any = null;
  recentScans: any[] = [];
  todayStats: any = {};

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadRecentScans();
    this.loadTodayStats();
  }

  onScanSuccess(qrData: string): void {
    this.apiService.validateQRCode(qrData, this.accessType).subscribe({
      next: (response) => {
        this.lastScan = {
          participantName: `${response.firstName} ${response.lastName}`,
          eventName: response.eventName,
          badgeCategory: response.badgeCategory,
          timestamp: new Date(),
          accessType: this.accessType
        };
        
        this.notificationService.success(
          `${this.accessType === 'entry' ? 'Entrée' : 'Sortie'} enregistrée`
        );
        
        this.loadRecentScans();
        this.loadTodayStats();
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'QR code invalide');
      }
    });
  }

  loadRecentScans(): void {
    this.apiService.getAccessLogs({ limit: 10 }).subscribe(data => {
      this.recentScans = data;
    });
  }

  loadTodayStats(): void {
    // Appeler endpoint stats du jour
    this.todayStats = {
      entries: 45,
      exits: 32,
      currentAttendees: 13
    };
  }
}
```

### 4. **Dashboard Participant**

**Composant:** `participant-dashboard.component.ts`

**Fonctionnalités:**
- Événements à venir (inscrits)
- Historique événements passés
- Badges disponibles (téléchargement)
- Pré-inscription à de nouveaux événements
- Statistiques personnelles:
  - Nombre d'événements participés
  - Heures totales
  - Catégories de badges collectés

**Template:**
```html
<div class="participant-dashboard p-6">
  <h1 class="text-3xl font-bold mb-6">Mon espace</h1>

  <!-- Quick Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <mat-card>
      <mat-card-content class="text-center">
        <mat-icon class="text-4xl text-primary-500">event</mat-icon>
        <h2 class="text-2xl font-bold">{{ participantStats?.totalEvents }}</h2>
        <p class="text-gray-500">Événements</p>
      </mat-card-content>
    </mat-card>
    <!-- Autres cartes stats -->
  </div>

  <!-- Upcoming Events -->
  <mat-card class="mb-6">
    <mat-card-header>
      <mat-card-title>Mes événements à venir</mat-card-title>
      <button mat-raised-button color="primary" routerLink="/events/browse">
        <mat-icon>add</mat-icon> S'inscrire à un événement
      </button>
    </mat-card-header>
    <mat-card-content>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <mat-card *ngFor="let event of upcomingEvents" class="event-card">
          <mat-card-header>
            <mat-card-title>{{ event.name }}</mat-card-title>
            <mat-card-subtitle>{{ event.startDate | date:'short' }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ event.location }}</p>
            <mat-chip-set>
              <mat-chip>{{ event.badgeCategory }}</mat-chip>
            </mat-chip-set>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="downloadBadge(event.badgeId)">
              <mat-icon>download</mat-icon> Télécharger badge
            </button>
            <button mat-button [routerLink]="['/events', event.id]">
              Détails
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </mat-card-content>
  </mat-card>

  <!-- Event History -->
  <mat-card>
    <mat-card-header>
      <mat-card-title>Historique</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <table mat-table [dataSource]="eventHistory">
        <ng-container matColumnDef="eventName">
          <th mat-header-cell *matHeaderCellDef>Événement</th>
          <td mat-cell *matCellDef="let element">{{ element.eventName }}</td>
        </ng-container>

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let element">{{ element.date | date }}</td>
        </ng-container>

        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef>Catégorie</th>
          <td mat-cell *matCellDef="let element">
            <mat-chip>{{ element.badgeCategory }}</mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="attended">
          <th mat-header-cell *matHeaderCellDef>Participation</th>
          <td mat-cell *matCellDef="let element">
            <mat-icon *ngIf="element.attended" class="text-success">check_circle</mat-icon>
            <mat-icon *ngIf="!element.attended" class="text-gray-400">cancel</mat-icon>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button (click)="viewBadge(element.badgeId)">
              <mat-icon>visibility</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-card-content>
  </mat-card>
</div>
```

---

## 🎯 COMPOSANTS FONCTIONNELS CLÉS

### 1. **Badge Designer** (Éditeur Template HTML)

**Composant:** `badge-designer.component.ts`

```typescript
export class BadgeDesignerComponent implements OnInit {
  templateForm: FormGroup;
  htmlPreview: SafeHtml;
  availablePlaceholders = [
    '{{firstName}}',
    '{{lastName}}',
    '{{eventName}}',
    '{{badgeNumber}}',
    '{{category}}',
    '{{qrCode}}'
  ];

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private apiService: ApiService
  ) {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      badge_category_id: ['', Validators.required],
      html_content: ['', Validators.required]
    });
  }

  onHtmlChange(): void {
    const html = this.templateForm.get('html_content')?.value;
    // Preview avec données fictives
    const previewHtml = html
      .replace('{{firstName}}', 'Jean')
      .replace('{{lastName}}', 'Dupont')
      .replace('{{eventName}}', 'Conférence Tech 2024')
      .replace('{{badgeNumber}}', 'BADGE-001')
      .replace('{{category}}', 'VIP')
      .replace('{{qrCode}}', 'data:image/png;base64,iVBORw0KG...');
    
    this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(previewHtml);
  }

  insertPlaceholder(placeholder: string): void {
    const currentHtml = this.templateForm.get('html_content')?.value || '';
    this.templateForm.patchValue({
      html_content: currentHtml + placeholder
    });
    this.onHtmlChange();
  }

  saveTemplate(): void {
    if (this.templateForm.valid) {
      this.apiService.createBadgeTemplate(this.templateForm.value).subscribe({
        next: () => {
          // Success
        },
        error: () => {
          // Error
        }
      });
    }
  }
}
```

**Template:**
```html
<div class="badge-designer p-6">
  <h2 class="text-2xl font-bold mb-4">Créateur de template de badge</h2>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Editor -->
    <mat-card>
      <mat-card-header>
        <mat-card-title>Éditeur HTML</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="templateForm">
          <mat-form-field class="w-full">
            <mat-label>Nom du template</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Catégorie de badge</mat-label>
            <mat-select formControlName="badge_category_id">
              <mat-option *ngFor="let cat of badgeCategories" [value]="cat.id">
                {{ cat.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div class="mb-4">
            <label class="block font-bold mb-2">Placeholders disponibles:</label>
            <div class="flex flex-wrap gap-2">
              <button 
                *ngFor="let ph of availablePlaceholders"
                mat-stroked-button 
                type="button"
                (click)="insertPlaceholder(ph)">
                {{ ph }}
              </button>
            </div>
          </div>

          <mat-form-field class="w-full">
            <mat-label>Code HTML</mat-label>
            <textarea 
              matInput 
              formControlName="html_content"
              rows="15"
              (input)="onHtmlChange()">
            </textarea>
          </mat-form-field>
        </form>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="saveTemplate()">
          Enregistrer
        </button>
      </mat-card-actions>
    </mat-card>

    <!-- Preview -->
    <mat-card>
      <mat-card-header>
        <mat-card-title>Aperçu</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="preview-container border-2 p-4" [innerHTML]="htmlPreview">
        </div>
      </mat-card-content>
    </mat-card>
  </div>
</div>
```

### 2. **Enrollment Approval** (Approbation Inscriptions)

**Template avec filtres et actions en masse:**
```html
<div class="enrollment-approval p-6">
  <h2 class="text-2xl font-bold mb-4">Approbation des inscriptions</h2>

  <mat-card>
    <!-- Filters -->
    <div class="filters mb-4 flex gap-4">
      <mat-form-field>
        <mat-label>Événement</mat-label>
        <mat-select [(ngModel)]="selectedEvent" (selectionChange)="loadEnrollments()">
          <mat-option [value]="null">Tous</mat-option>
          <mat-option *ngFor="let event of events" [value]="event.id">
            {{ event.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Statut</mat-label>
        <mat-select [(ngModel)]="selectedStatus" (selectionChange)="loadEnrollments()">
          <mat-option value="pending">En attente</mat-option>
          <mat-option value="approved">Approuvées</mat-option>
          <mat-option value="rejected">Refusées</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <!-- Actions en masse -->
    <div class="bulk-actions mb-4" *ngIf="selection.hasValue()">
      <button mat-raised-button color="primary" (click)="approveBulk()">
        Approuver ({{ selection.selected.length }})
      </button>
      <button mat-raised-button color="warn" (click)="rejectBulk()">
        Rejeter ({{ selection.selected.length }})
      </button>
    </div>

    <!-- Table -->
    <table mat-table [dataSource]="enrollments" matSort>
      <ng-container matColumnDef="select">
        <th mat-header-cell *matHeaderCellDef>
          <mat-checkbox 
            (change)="$event ? toggleAll() : null"
            [checked]="selection.hasValue() && isAllSelected()">
          </mat-checkbox>
        </th>
        <td mat-cell *matCellDef="let row">
          <mat-checkbox
            (click)="$event.stopPropagation()"
            (change)="$event ? selection.toggle(row) : null"
            [checked]="selection.isSelected(row)">
          </mat-checkbox>
        </td>
      </ng-container>

      <ng-container matColumnDef="participant">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Participant</th>
        <td mat-cell *matCellDef="let element">
          {{ element.firstName }} {{ element.lastName }}
        </td>
      </ng-container>

      <ng-container matColumnDef="event">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Événement</th>
        <td mat-cell *matCellDef="let element">{{ element.eventName }}</td>
      </ng-container>

      <ng-container matColumnDef="enrollmentDate">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Date inscription</th>
        <td mat-cell *matCellDef="let element">{{ element.enrollmentDate | date }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Statut</th>
        <td mat-cell *matCellDef="let element">
          <mat-chip [class]="'status-' + element.status">
            {{ element.status }}
          </mat-chip>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let element">
          <button 
            mat-icon-button 
            color="primary"
            *ngIf="element.status === 'pending'"
            (click)="approve(element.id)"
            matTooltip="Approuver">
            <mat-icon>check</mat-icon>
          </button>
          <button 
            mat-icon-button 
            color="warn"
            *ngIf="element.status === 'pending'"
            (click)="reject(element.id)"
            matTooltip="Rejeter">
            <mat-icon>close</mat-icon>
          </button>
          <button 
            mat-icon-button
            (click)="viewDetails(element)"
            matTooltip="Détails">
            <mat-icon>visibility</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator 
      [pageSizeOptions]="[10, 25, 50]"
      showFirstLastButtons>
    </mat-paginator>
  </mat-card>
</div>
```

### 3. **Event Statistics** (Statistiques Détaillées)

```typescript
export class EventStatsComponent implements OnInit {
  eventId: number;
  stats: any = {};
  chartData: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.eventId = +this.route.snapshot.params['id'];
    this.loadStats();
  }

  loadStats(): void {
    this.apiService.getEventStats(this.eventId).subscribe(data => {
      this.stats = data;
      this.prepareCharts();
    });
  }

  prepareCharts(): void {
    // Badge distribution pie chart
    this.badgeDistributionChart = {
      labels: Object.keys(this.stats.badgeDistribution),
      datasets: [{
        data: Object.values(this.stats.badgeDistribution),
        backgroundColor: ['#2196f3', '#ff9800', '#4caf50']
      }]
    };

    // Hourly entries line chart
    this.hourlyEntriesChart = {
      labels: this.stats.hourlyEntries.map((h: any) => h.hour),
      datasets: [{
        label: 'Entrées',
        data: this.stats.hourlyEntries.map((h: any) => h.count),
        borderColor: '#2196f3',
        fill: false
      }]
    };
  }
}
```

---

## 🔄 ROUTING CONFIGURATION

```typescript
// app-routing.module.ts
const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'super-admin',
        component: SuperAdminDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['super_admin'] }
      },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'controller',
        component: ControllerDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['controller'] }
      },
      {
        path: 'participant',
        component: ParticipantDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['participant'] }
      }
    ]
  },
  {
    path: 'organizations',
    loadChildren: () => import('./features/organizations/organizations.module').then(m => m.OrganizationsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'events',
    loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'badges',
    loadChildren: () => import('./features/badges/badges.module').then(m => m.BadgesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'enrollments',
    loadChildren: () => import('./features/enrollments/enrollments.module').then(m => m.EnrollmentsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'access-control',
    loadChildren: () => import('./features/access-control/access-control.module').then(m => m.AccessControlModule),
    canActivate: [AuthGuard],
    data: { roles: ['controller', 'admin', 'super_admin'] }
  },
  {
    path: 'statistics',
    loadChildren: () => import('./features/statistics/statistics.module').then(m => m.StatisticsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard],
    data: { roles: ['super_admin', 'admin'] }
  },
  { 
    path: 'unauthorized', 
    component: UnauthorizedComponent 
  },
  { 
    path: '**', 
    component: NotFoundComponent 
  }
];
```

---

## 🎨 STYLES GLOBAUX (styles.scss)

```scss
/* Custom Material Theme */
@use '@angular/material' as mat;

@include mat.core();

$my-primary: mat.define-palette(mat.$blue-palette, 500);
$my-accent: mat.define-palette(mat.$orange-palette, 500);
$my-warn: mat.define-palette(mat.$red-palette);

$my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  )
));

@include mat.all-component-themes($my-theme);

/* Custom Snackbar Styles */
.snackbar-success {
  background-color: #4caf50 !important;
  color: white !important;
}

.snackbar-error {
  background-color: #f44336 !important;
  color: white !important;
}

.snackbar-info {
  background-color: #2196f3 !important;
  color: white !important;
}

.snackbar-warning {
  background-color: #ff9800 !important;
  color: white !important;
}

/* Custom Card Styles */
.stat-card {
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
}

/* Status Chips */
.status-pending {
  background-color: #ff9800;
  color: white;
}

.status-approved {
  background-color: #4caf50;
  color: white;
}

.status-rejected {
  background-color: #f44336;
  color: white;
}
```

---

## ✅ CHECKLIST DE DÉVELOPPEMENT

### Phase 1 - Setup (Semaine 1)
- [ ] Initialiser projet Angular avec CLI
- [ ] Installer dépendances (Material, Tailwind, etc.)
- [ ] Configurer Tailwind CSS
- [ ] Créer structure de dossiers
- [ ] Configurer environnements
- [ ] Créer models TypeScript

### Phase 2 - Core (Semaine 1-2)
- [ ] Auth Service + Guards + Interceptors
- [ ] API Service
- [ ] Notification Service
- [ ] Layouts (Main, Auth, Dashboard)
- [ ] Header, Sidebar, Footer components
- [ ] Login/Register pages

### Phase 3 - Dashboards (Semaine 2-3)
- [ ] Super Admin Dashboard
- [ ] Admin Dashboard
- [ ] Controller Dashboard (avec QR scanner)
- [ ] Participant Dashboard

### Phase 4 - CRUD (Semaine 3-4)
- [ ] Organizations CRUD
- [ ] Events CRUD
- [ ] Users management
- [ ] Badge categories & templates
- [ ] Enrollment forms

### Phase 5 - Features Avancées (Semaine 4-5)
- [ ] Badge Designer (éditeur HTML)
- [ ] Enrollment Approval interface
- [ ] QR Scanner integration
- [ ] Access logs display
- [ ] Statistics & Charts

### Phase 6 - Polish (Semaine 5-6)
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Validations formulaires
- [ ] Animations
- [ ] Tests E2E (optionnel)

---

## 🚀 COMMANDES UTILES

```bash
# Créer un nouveau composant
ng generate component features/events/event-list

# Créer un nouveau service
ng generate service core/services/notification

# Créer un nouveau module
ng generate module features/badges --routing

# Lancer en dev
ng serve

# Build production
ng build --configuration production

# Linter
ng lint

# Tests
ng test
```

---

## 📱 RESPONSIVE DESIGN

Utiliser Tailwind pour responsive:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid adaptatif pour dashboards
- Sidebar collapsible sur mobile
- Tables scrollables horizontalement

Exemple:
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Cards responsive -->
</div>
```

---

## 🔔 NOTIFICATIONS & FEEDBACK

- Snackbar pour messages temporaires
- Dialog pour confirmations
- Progress spinner pour chargements
- Skeleton loaders pour listes
- Toast notifications pour actions critiques

---

## 🎯 PRIORITÉS UX/UI

1. **Navigation intuitive** - Menu clair par rôle
2. **Feedback immédiat** - Loading, success, errors
3. **Accessibilité** - Aria labels, keyboard navigation
4. **Performance** - Lazy loading, pagination
5. **Mobile-friendly** - Responsive à 100%

---

**REMARQUES FINALES:**

- Utiliser **Angular Signals** (Angular 17+) pour state management réactif
- Implémenter **Lazy Loading** sur tous les modules fonctionnels
- Prévoir **PWA** pour accès offline (optionnel)
- Ajouter **Dark Mode** (optionnel mais apprécié)
- Documenter composants avec **Storybook** (optionnel)
- Utiliser **RxJS** proprement (unsubscribe, shareReplay, etc.)

**BONUS:**
- WebSocket pour notifications temps réel
- Export PDF/Excel des statistiques
- Multi-langue avec ngx-translate
- Thèmes personnalisables par organisation
- PWA avec service workers
