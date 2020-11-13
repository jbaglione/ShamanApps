import { Injectable } from '@angular/core';
import { tap, catchError, filter, take, switchMap } from 'rxjs/operators';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Usuario } from '../models';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isTokenRefreshing = false;
  private tokenSubject: BehaviorSubject<Usuario> = new BehaviorSubject<Usuario>(null);

  constructor(private authenticationService: AuthenticationService) {}

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
                  if ((<HttpErrorResponse>err).status == 401 &&  err.error.tokenExpired) {
                        console.log('Token expired. Attempting refresh ...');
                        return this.handleHttpResponseError(request, next);
                  } else if ((<HttpErrorResponse>err).status == 400 &&  err.error.errorTokenRefresh) {
                    this.authenticationService.logout();
                    location.reload();
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
                this.isTokenRefreshing = false;
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
            );
        } else {
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
    let currentUser = this.authenticationService.currentUser;

    if (currentUser && currentUser.tokenInfo) {
      return request.clone({
        setHeaders: {
          Authorization: `${currentUser.tokenInfo.tokenType} ${currentUser.tokenInfo.accessToken}`,
          PageId: (this.authenticationService.currentPageId != null ) ? this.authenticationService.currentPageId.toString() : '0'
        }
      });
    } else {
      return request.clone();
    }
  }

  // => PageId: this.getPageId().toString()
  private getPageId(): number {
    if (this.authenticationService.currentPageId == null || this.authenticationService.currentPageId == 0) {
      let params = new URLSearchParams(window.location.search);
      // params broken when cross by login (returnUrl)
      let returnUrl = ''; // Get real returnUrl!
      if (params.has('toPageId')) {
        this.authenticationService.currentPageId = parseInt(params.get('toPageId'));
        return this.authenticationService.currentPageId;
      } else {
        params = new URLSearchParams(returnUrl);
        if (params.has('toPageId')) {
          this.authenticationService.currentPageId = parseInt(params.get('toPageId'));
          return this.authenticationService.currentPageId;
        } else {
          return 0;
        }
      }
    } else {
      return this.authenticationService.currentPageId;
    }
  }
}
