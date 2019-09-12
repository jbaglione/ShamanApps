import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { catchError, tap } from 'rxjs/operators';
import { AppConfig } from '../../configs/app.config';
import { Observable, of } from 'rxjs';
import { LoggerService } from '../../services/logger.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Bitacora } from '@app/models/bitacora.model';
import { listable } from '@app/models/listable.model';

@Injectable()
export class BitacorasService {
  pamiUrl: string;
  bitacoraApiUrl: string;
  // private http: Http,
  constructor(private httpClient: HttpClient, public snackBar: MatSnackBar) {
    this.bitacoraApiUrl = AppConfig.endpoints.api + 'bitacoras';
    this.pamiUrl = AppConfig.endpoints.pami;
  }

  // #region Mock
  // bitacoras: Bitacora[];
  // public getBitacoras() {
  //   this.bitacoras = [{ id: 1, nro: 1, fecha: '2018-10-20T00:00:00', hora: '17:33',
  //   titulo: 'Primer bitacora de prueba', motivo: new listable('1', 'Mock motivo'),
  //   administrador: 'Deberia ser un Id Administrador',
  //   estado: new listable('1', 'Mock estado'),
  //   ultFechaHora: '2018-11-01T17:33:26.3742517-03:00',
  //   diasRta: 1, duracion: 1, registraciones: null }]; // , destinos: null
  //   return this.bitacoras;
  // }
  // #endregion

  private handleError<T>(operation = 'operation', result?: T, showMessage: boolean = true) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      LoggerService.log(`${operation} failed: ${error.message}`);

      if (error.status >= 500) {
        throw error;
      }

      if (showMessage) {
        this.showSnackBar('Ha ocurrido un error al ' + operation);
      }

      return of(result as T);
    };
  }

  public GetBitacoras(): Observable<Bitacora[]> {
    const url = `${this.bitacoraApiUrl}`;
    return this.httpClient.get<Bitacora[]>(url).pipe(
      tap(() => LoggerService.log('fetched GetBitacoras')),
      catchError(this.handleError<Bitacora[]>('Obtener las Bitacoras'))
    );
  }

  public GetBitacorasToken(token: string): Observable<any> {
    const url = `${this.bitacoraApiUrl}`;
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `${token}` });
    return this.httpClient.get<Bitacora[]>(url, { headers: headerOptions }).pipe(
      tap(() => LoggerService.log('fetched GetBitacorasToken')),
      catchError(this.handleError<Bitacora[]>('Obtener las Bitacoras'))
    );
  }

  public GetBitacora(id: number): Observable<Bitacora> {
    const url = `${this.bitacoraApiUrl}/${id}`;
    return this.httpClient.get<Bitacora>(url).pipe(
      tap(() => LoggerService.log(`fetched bitacora id=${id}`)),
      catchError(this.handleError<Bitacora>(`Obtener la Bitacora`))
    );
  }

  public GetMotivos(): Observable<listable> {
    const url = `${this.bitacoraApiUrl}Listables/GetMotivos`;
    return this.httpClient.get<listable>(url).pipe(
      tap(() => LoggerService.log('fetched GetMotivos')),
      catchError(this.handleError<listable>('Obtener los Motivos'))
    );
  }

  public GetEstados(): Observable<listable> {
    const url = `${this.bitacoraApiUrl}Listables/GetEstados`;
    return this.httpClient.get<listable>(url).pipe(
      tap(() => LoggerService.log('fetched GetEstados')),
      catchError(this.handleError<listable>('Obtener los Estados'))
    );
  }

  public GetNewBitacoraNro(): Observable<number> {
    const url = `${this.bitacoraApiUrl}GetNewBitacoraNro`;
    return this.httpClient.get<number>(url).pipe(
      tap(() => LoggerService.log('fetched GetNewBitacoraNro')),
      catchError(this.handleError<number>('Obtener datos'))
    );
  }

  public CreateBitacora(bitacora: Bitacora) {
    const isNew = bitacora.id == 0;
    const url = `${this.bitacoraApiUrl}`;
    const body = JSON.stringify(bitacora);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, body, { headers: headerOptions }).pipe(
      tap(() => {
        LoggerService.log('fetched CreateBitacora');
        this.showSnackBar(isNew ? 'Bitacora creada' : 'Bitacora actualizada');
      }),
      catchError(this.handleError<Bitacora>(isNew ? 'crear la Bitacora' : 'actualizar la Bitacora'))
    );
  }

  private showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
