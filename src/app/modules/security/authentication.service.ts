import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AppConfig } from '@app/configs/app.config';
import { Usuario, GrupoAccesosMicrositios, ForgotPasswordResult, Relacion } from './models/index';
import { UsuarioRegister } from './models/register.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public readonly CURRENT_USER: string = 'currentUser';
  private userName = new BehaviorSubject<string>(this.isValidUser(this.currentUser) ? this.currentUser.username : '');

  constructor(private httpClient: HttpClient) {}

  get currentUser(): Usuario {
    return JSON.parse(localStorage.getItem(this.CURRENT_USER)) as Usuario;
  }

  get currentUserName(): Observable<string> {
    return this.userName.asObservable();
  }

  get currentPageId(): number {
    if (!isNaN(parseInt(sessionStorage.getItem('currentPageId')))) {
      return parseInt(sessionStorage.getItem('currentPageId'));
    } else {
      return 0;
    }
  }

  set currentPageId(pageId: number) {
    sessionStorage.setItem('currentPageId', pageId.toString());
  }

  get currentAcceso(): number {
    return this.currentUser.accesos.find(a => a.pagina == this.currentPageId).codigo;
  }


  login(username: string, password: string): Observable<Usuario> {
    return this.httpClient
      .post<Usuario>(`${AppConfig.settings.endpoints.security}users/Authenticate`, {username, password})
      .pipe(
        map(user => {
          if (this.isValidUser(user)) {
            localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
            this.userName.next(this.currentUser.username);
          }
          return user;
        })
      );
  }

  refreshToken(): Observable<Usuario> {
    let usuario: Usuario = this.currentUser;
    let token: string = usuario.tokenInfo.accessToken;
    let refreshToken: string = usuario.tokenInfo.refreshToken;

    return this.httpClient
      .post<Usuario>(`${AppConfig.settings.endpoints.security}users/RefreshToken`, { token, refreshToken })
      .pipe(
        map(user => {
          if (this.isValidUser(user)) {
            localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
            this.userName.next(this.currentUser.username);
          }
          return user;
        }),
        catchError(
          (err): Observable<any> => {
            console.log('Error en refresh');
            return null;
          }
        )
      );
  }

  logout() {
    localStorage.removeItem(this.CURRENT_USER);
    this.userName.next('');
  }

  getGruposMicrositios(): Observable<GrupoAccesosMicrositios[]> {
    return this.httpClient
      .get<GrupoAccesosMicrositios[]>(
        `${AppConfig.settings.endpoints.security}users/micrositios`
      )
      .pipe(
        map(grupoMicrositios => {
          const currentUser = this.currentUser;
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

  forgotPassword(pEmail: string): Observable<ForgotPasswordResult> {
    return this.httpClient
      .post<ForgotPasswordResult>(
        `${AppConfig.settings.endpoints.security}users/ForgotPassword`,
        { email: pEmail }
      )
      .pipe(
        map(forgotPasswordResult => {
          return forgotPasswordResult;
        })
      );
  }

  changePassword(userId: number, oldPassword: string, newPassword: string): Observable<void> {
    return this.httpClient
      .post<void>(
        `${AppConfig.settings.endpoints.security}users/changePassword`,
        { id: userId, oldPassword: oldPassword, newPassword: newPassword }
      );
  }

  register(register: UsuarioRegister): Observable<void> {
    const body = JSON.stringify(register);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.post<void>(
      `${AppConfig.settings.endpoints.security}users/Register`,
      body,
      { headers: headerOptions }
    );
  }

  getRelacion(): Relacion[] {
    return  [
      {value: 'Cliente', viewValue: 'Cliente'},
      {value: 'EmpresaPrestadora', viewValue: 'Empresa Prestadora'},
      {value: 'PrestadorDeMovil', viewValue: 'Prestador de Movil'},
      {value: 'Personal', viewValue: 'Personal'},
      {value: 'Medico', viewValue: 'Médico'},
      {value: 'Otros', viewValue: 'Otros'}
    ];
  }

  private isValidUser(usuario: Usuario): boolean {
    if (usuario && usuario.tokenInfo && usuario.tokenInfo.accessToken) {
      return true;
    } else {
      return false;
    }
  }
}
