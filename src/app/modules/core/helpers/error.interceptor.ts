import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '@app/modules/security/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private authenticationService: AuthenticationService
  ) {}

  intercept( request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(errorResponse => {
        let errorMessage = '';
        // if (err.status === 401) {
        //   // auto logout if 401 response returned from api
        //   this.authenticationService.logout();
        //   this.toastrService.info('Sesi�n Finalizada');
        //   this.router.navigate(['/login']);
        if (errorResponse.error.status === 400) {
          for (const key in errorResponse.error.errors) {
            if (errorResponse.error.errors.hasOwnProperty(key) && Array.isArray(errorResponse.error.errors[key])) {
              errorResponse.error.errors[key].forEach(x => {
                errorMessage += '- ' + x + '<br/>';
              });
            }
          }
        } else if (errorResponse.status == 401) {
          errorMessage = errorResponse.error.detail;
        } else if (errorResponse.status >= 500) {
          errorMessage = 'Error en el servidor.';
        } else {
          errorMessage = 'Hubo un inconveniente, intente mas tarde.';
        }
        this.toastrService.error(errorMessage, '', { enableHtml: true });
        return throwError(errorMessage);
      })
    );
  }
}
