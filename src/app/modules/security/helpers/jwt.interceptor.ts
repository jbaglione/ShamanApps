import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser$ = this.authenticationService.currentUserValue;
    if (currentUser$ && currentUser$.tokenInfo) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentUser$.tokenInfo.tokenType} ${currentUser$.tokenInfo.accessToken}`,
          PageId: (this.authenticationService.getCurrentPageId() != null ) ? this.authenticationService.getCurrentPageId().toString() : '0'
        }
      });
    }
    return next.handle(request);
  }
}
