import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfig } from '@app/configs/app.config';
import { Usuario, GrupoAccesosMicrositios, ForgotPasswordResult } from './models/index';
import * as jwt_decode from 'jwt-decode';
import { UsuarioRegister } from './models/register.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public readonly CURRENT_USER: string = 'currentUser';
  private readonly LOGIN_STATUS: string = 'loginStatus';
  private loginStatus = new BehaviorSubject<boolean>(this.checkloginstatus());
  private userName    = new BehaviorSubject<string>(this.currentUserValue != null ? this.currentUserValue.username : '');

  constructor( private httpClient: HttpClient) { }

  public get currentUserValue(): any {
    const currentUser: Usuario =  JSON.parse(localStorage.getItem(this.CURRENT_USER));
    if (currentUser == null) {
      return null;
    } else {
      return currentUser;
    }
  }

  public get isLoggesIn() {
      return this.loginStatus.asObservable();
  }

  get currentUserName() {
      return this.userName.asObservable();
  }

  login(username: string, password: string) {
    return this.httpClient
      .post<Usuario>(`${AppConfig.endpoints.security}users/Authenticate`, { username, password })
      .pipe(
        map(user => {
          if (user && user.tokenInfo && user.tokenInfo.accessToken) {
            this.loginStatus.next(true);
            localStorage.setItem(this.LOGIN_STATUS, '1');
            localStorage.setItem( this.CURRENT_USER, JSON.stringify(user) );
            this.userName.next(this.currentUserValue.username);
          }
          return user;
        })
      );
  }

  refreshToken(): Observable<any> {
    const usuario: Usuario = this.currentUserValue;
    const token: string = usuario.tokenInfo.accessToken;
    const refreshToken: string = usuario.tokenInfo.refreshToken;

    return this.httpClient
      .post<any>(`${AppConfig.endpoints.security}users/RefreshToken`, { token, refreshToken })
      .pipe(
        map(user => {
          if (user && user.tokenInfo && user.tokenInfo.accessToken) {
            this.loginStatus.next(true);
            localStorage.setItem(this.LOGIN_STATUS, '1');
            localStorage.setItem( this.CURRENT_USER, JSON.stringify(user) );
            this.userName.next(this.currentUserValue.username);
          }
          return <any>user;
        }),
        catchError((err): Observable<any> => {
          console.log('Error en refresh');
          return null;
        })
      );
  }

  loginByToken(token: string) {
    return this.httpClient
      .post<any>(`${AppConfig.endpoints.security}users/authenticateByToken`, { token })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            this.loginStatus.next(true);
            localStorage.setItem(this.LOGIN_STATUS, '1');
            localStorage.setItem(this.CURRENT_USER,JSON.stringify(user));
            this.userName.next(this.currentUserValue.username);
          }

          return user;
        })
      );
  }

  logout() {
    this.loginStatus.next(false);
    localStorage.removeItem(this.CURRENT_USER);
    localStorage.setItem(this.LOGIN_STATUS, '0');
  }

  getGruposMicrositios(): Observable<GrupoAccesosMicrositios[]> {
    return this.httpClient
      .get<GrupoAccesosMicrositios[]>(`${AppConfig.endpoints.security}users/micrositios`)
      .pipe(
        map(grupoMicrositios => {
          const currentUser = this.currentUserValue;
          currentUser.micrositiosV1 = [];
          grupoMicrositios.forEach(gm => {
            gm.accesosMicrositios.forEach(am => {
              if (am.urlV1 != '') {
                currentUser.micrositiosV1.push(am);
              }
            });
          });
          localStorage.setItem(this.CURRENT_USER, JSON.stringify(currentUser));
          return grupoMicrositios;
        })
      );
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.currentUserValue.tokenInfo.accessToken;
    }
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  forgotPassword(pEmail: string): Observable<ForgotPasswordResult> {
    return this.httpClient
      .post<ForgotPasswordResult>(`${AppConfig.endpoints.security}users/ForgotPassword`, { email: pEmail })
      .pipe(
        map(forgotPasswordResult => {
          return forgotPasswordResult;
        })
      );
  }

  register(register: UsuarioRegister): Observable<void> {
    const body = JSON.stringify(register);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .post<void>(`${AppConfig.endpoints.security}users/Register`, body, { headers: headerOptions });
  }

  getAccesosCurrentUser(): number {
    return this.currentUserValue.accesos.find(a => a.pagina == this.getCurrentPageId() ).codigo;
  }

  setCurrentPageId(pageId: number) {
    sessionStorage.setItem('currentPageId', pageId.toString());
  }

  getCurrentPageId(): number {
    return parseInt(sessionStorage.getItem('currentPageId'));
  }

  checkloginstatus(): boolean {
    const loginCookie = localStorage.getItem(this.LOGIN_STATUS);
    const user = this.currentUserValue;

    if (loginCookie == '1') {
      if (user && user.tokenInfo && user.tokenInfo.accessToken) {
        return true;
      }
    }
    return false;
  }

}
