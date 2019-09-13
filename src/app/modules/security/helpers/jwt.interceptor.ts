import { Injectable } from '@angular/core';
import { tap, catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Usuario } from '../models';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isTokenRefreshing = false;
  tokenSubject: BehaviorSubject<Usuario> = new BehaviorSubject<Usuario>(null);

  constructor(
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.attachTokenToRequest(request))
            .pipe(
              tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                  console.log('Success ' + event.url);
                }
              }),
              catchError((err): Observable<any> => {
                if (err instanceof HttpErrorResponse) {
                  if ((<HttpErrorResponse>err).status == 400 &&
                     err.error.tokenExpired != undefined && err.error.tokenExpired &&
                     !this.isTokenRefreshing) {
                        console.log('Token expired. Attempting refresh ...');
                        return this.handleHttpResponseError(request, next);
                  } else {
                    return throwError(<HttpErrorResponse>err);
                  }
                } else {
                  return throwError(err);
                }
              })
            );
  }

  // Method to handle http error response
  private handleHttpResponseError(request: HttpRequest<any>, next: HttpHandler) {
      if (!this.isTokenRefreshing) {
          this.isTokenRefreshing = true;
          this.tokenSubject.next(null);

          return this.authenticationService.refreshToken()
            .pipe(
              switchMap((user: any) => {
                if (user && user.tokenInfo && user.tokenInfo.accessToken) {
                    this.tokenSubject.next(user);
                    localStorage.setItem( this.authenticationService.CURRENT_USER, JSON.stringify(user) );
                    console.log('Token refreshed...');
                    return next.handle(this.attachTokenToRequest(request));
                }
                return <any>this.authenticationService.logout();
              }),
              catchError(err => {
                this.authenticationService.logout();
                return throwError(err);
              }),
              finalize(() => {
                  this.isTokenRefreshing = false;
              })
            );
        } else {
          this.isTokenRefreshing = false;
          return this.tokenSubject.pipe(
            filter(user => user != null),
            take(1),
            switchMap(user => {
              return next.handle(this.attachTokenToRequest(request));
            })
          );
        }
  }

  private attachTokenToRequest(request: HttpRequest<any>) {
    const currentUser = this.authenticationService.currentUserValue;

    if (currentUser && currentUser.tokenInfo) {
      return request.clone({
        setHeaders: {
          Authorization: `${currentUser.tokenInfo.tokenType} ${currentUser.tokenInfo.accessToken}`,
          PageId: (this.authenticationService.getCurrentPageId() != null ) ? this.authenticationService.getCurrentPageId().toString() : '0'
        }
      });
    } else {
      return request.clone();
    }
  }
}
