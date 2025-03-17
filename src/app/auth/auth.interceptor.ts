import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { STORAGE_KEYS } from '../shared/constants';
import { environment } from '../../environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const toastr = inject(ToastrService);
 // Check if the URL is relative (avoids modifying absolute URLs like external APIs)
 const isApiUrl = !req.url.startsWith('http') && !req.url.startsWith('//');

 const updatedReq = isApiUrl
     ? req.clone({ url: `${environment.apiUrl}${req.url}` })
     : req;
     
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN); // Updated to use constant directly
    const clonedReq = token
        ? updatedReq.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : updatedReq;

    return next(clonedReq).pipe(
        catchError((error) => {
            switch (error.status) {
                case 400:
                    toastr.error('Invalid request. Please check your data.');
                    break;
                case 401:
                    toastr.warning('Session expired. Please log in again.');
                    break;
                case 403:
                    toastr.error('Access denied. Insufficient permissions.');
                    break;
                case 404:
                    toastr.info('Requested resource not found.');
                    break;
                case 500:
                    toastr.error('Server error. Please try again later.');
                    break;
                default:
                    toastr.error('An unexpected error occurred.');
                    break;
            }
            return throwError(() => error);
        })
    );
};
