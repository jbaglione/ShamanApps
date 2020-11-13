import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { catchError, tap } from 'rxjs/operators';
import { AppConfig } from '../../configs/app.config';
import { Observable, of } from 'rxjs';
// import { LoggerService } from '../../services/logger.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Bitacora } from '@app/models/bitacora.model';
import { Listable } from '@app/models/listable.model';
import { Adjunto } from '@app/models/adjunto.model';
import { NotificationService } from '../core/services/notification.service';
import { CommonService } from '../shared/services/common.service';
import { SiteInfo } from '@app/models/site-info.model';

@Injectable()
export class BitacorasService {
  bitacoraApiUrl: string;
  // private http: Http,
  constructor(private httpClient: HttpClient,
    public snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private commonServices: CommonService) {
    this.bitacoraApiUrl = AppConfig.settings.endpoints.api + 'bitacoras';
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
      // LoggerService.log(`${operation} failed: ${error.message}`);

      if (error.status >= 500) {
        throw error;
      }

      if (showMessage) {
        // this.showSnackBar('Ha ocurrido un error al ' + operation);
        this.notificationService.showError('Ha ocurrido un error al ' + operation);
      }

      return of(result as T);
    };
  }

  public GetBitacoras(): Observable<Bitacora[]> {
    const url = `${this.bitacoraApiUrl}/GetBitacoras`;
    return this.httpClient.get<Bitacora[]>(url).pipe(
      // tap(() => LoggerService.log('fetched GetBitacoras')),
      catchError(this.handleError<Bitacora[]>('obtener los Hallazgos'))
    );
  }

  public GetBitacorasToken(token: string): Observable<any> {
    const url = `${this.bitacoraApiUrl}`;
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `${token}` });
    return this.httpClient.get<Bitacora[]>(url, { headers: headerOptions }).pipe(
      // tap(() => LoggerService.log('fetched GetBitacorasToken')),
      catchError(this.handleError<Bitacora[]>('obtener los Hallazgos'))
    );
  }

  public GetBitacora(id: number): Observable<Bitacora> {
    const url = `${this.bitacoraApiUrl}/${id}`;
    return this.httpClient.get<Bitacora>(url).pipe(
      // tap(() => LoggerService.log(`fetched bitacora id=${id}`)),
      catchError(this.handleError<Bitacora>(`obtener el Hallazgo`))
    );
  }

  public GetImages(idForAjd: string, idForAjdSubEnt: string): Observable<Adjunto[]> {
    const url = `${this.bitacoraApiUrl}/${idForAjd}/${idForAjdSubEnt}`;
    return this.httpClient.get<Adjunto[]>(url).pipe(
      // tap(() => LoggerService.log('fetched GetBitacoras')),
      catchError(this.handleError<Adjunto[]>('obtener las Imagenes'))
    );
  }


  public GetMotivos(): Observable<Listable[]> {
    const url = `${this.bitacoraApiUrl}/GetMotivos`;
    return this.httpClient.get<Listable[]>(url).pipe(
      // tap(() => LoggerService.log('fetched GetMotivos')),
      catchError(this.handleError<Listable[]>('obtener los Motivos'))
    );
  }

  public GetEstados(): Observable<Listable[]> {
    const url = `${this.bitacoraApiUrl}/GetEstados`;
    return this.httpClient.get<Listable[]>(url).pipe(
      // tap(() => LoggerService.log('fetched GetEstados')),
      catchError(this.handleError<Listable[]>('obtener los Estados'))
    );
  }

  public GetNewBitacoraNro(): Observable<number> {
    const url = `${this.bitacoraApiUrl}/GetNewBitacoraNro`;
    return this.httpClient.get<number>(url).pipe(
      // tap(() => LoggerService.log('fetched GetNewBitacoraNro')),
      catchError(this.handleError<number>('obtener datos'))
    );
  }

  public CreateBitacora(bitacora: Bitacora, site: SiteInfo) {
    const isNew = bitacora.id == 0;
    const url = `${this.bitacoraApiUrl}`;
    const body = JSON.stringify(bitacora);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, body, { headers: headerOptions }).pipe(
      tap(() => {
        // LoggerService.log('fetched CreateBitacora');
        this.commonServices.showSnackBarSucces(isNew ? site.nombreSingular + (site.nombreGenero == 'M' ? ' creado' : ' creada') :
                                                       site.nombreSingular + (site.nombreGenero == 'M' ? ' actualizado' : ' actualizada'));
      }),
      catchError(this.handleError<Bitacora>(isNew ? 'crear ' + (site.nombreGenero == 'M' ? 'el ' : 'la' ) + site.nombreSingular :
                                                    'actualizar ' + (site.nombreGenero == 'M' ? 'el ' : 'la ') + site.nombreSingular))
    );
  }
}
