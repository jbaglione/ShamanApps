import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig } from '@app/configs/app.config';
import { Usuario, GrupoAccesosMicrositios, ForgotPasswordResult, AccesoMicrositio } from './models/index';
import * as jwt_decode from 'jwt-decode';
import { UsuarioRegister } from './models/register.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly CURRENT_USER: string = 'currentUser';
  private currentUser: BehaviorSubject<Usuario>;
  public currentUser$: Observable<Usuario>;

  constructor( private httpClient: HttpClient) {
    this.currentUser = new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem(this.CURRENT_USER)));
    this.currentUser$ = this.currentUser.asObservable();
  }

  public get currentUserValue(): Usuario {
    return this.currentUser.value;
  }

  login(username: string, password: string) {
    return this.httpClient
      .post<Usuario>(`${AppConfig.endpoints.security}users/Authenticate`, { username, password })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.tokenInfo && user.tokenInfo.accessToken) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem( this.CURRENT_USER, JSON.stringify(user) );
            this.currentUser.next(user);
          }

          return user;
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
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem(
              this.CURRENT_USER,
              JSON.stringify(user)
            );
            this.currentUser.next(user);
          }

          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(this.CURRENT_USER);
    this.currentUser.next(null);
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

          const mockMicrositio: AccesoMicrositio = {
            codigo: 9999,
            jerarquia: 300,
            titulo: 'Aditorias Moviles',
            url: '/auditoriasmoviles/auditorias',
            urlV1: ''
          };
          currentUser.micrositiosV1.push(mockMicrositio);

          localStorage.setItem(this.CURRENT_USER, JSON.stringify(currentUser));
          this.currentUser.next(currentUser);
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
    var as =  this.currentUserValue.accesos.find(a => a.pagina === this.getCurrentPageId());
    if(as!= null)
    return as.codigo;
  }

  setCurrentPageId(pageId: number) {
    sessionStorage.setItem('currentPageId', pageId.toString());
  }

  getCurrentPageId(): number {
    return parseInt(sessionStorage.getItem('currentPageId'));
  }
}
