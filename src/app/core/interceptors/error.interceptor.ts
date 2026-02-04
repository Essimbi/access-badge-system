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
    ) { }

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
