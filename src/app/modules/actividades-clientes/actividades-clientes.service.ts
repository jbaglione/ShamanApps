import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { AppConfig } from '../../configs/app.config';
import { Observable, of, throwError as observableThrowError } from 'rxjs';
import { LoggerService } from '../../services/logger.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ClientesGestion } from 'src/app/models/clientes-gestion';
import { listable } from 'src/app/models/listable.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ClienteConsumo } from 'src/app/models/cliente-consumo';
import { ClientePotencial } from 'src/app/models/cliente-potencial.model';
import { ClienteReclamo } from 'src/app/models/cliente-reclamo';
import { ClienteCuentaCorriente } from 'src/app/models/cliente-cuentacorriente';

@Injectable()
export class ActividadesClientesService {

  actividadesApiUrl: string;
  gestionesApiUrl: string;
  consumosApiUrl: string;
  reclamosApiUrl: string;
  cuentaCorrienteApiUrl: string;
  vendedoresApiUrl: string;

  clienteName: string;

  constructor(private httpClient: HttpClient, public snackBar: MatSnackBar) {
    this.actividadesApiUrl = AppConfig.endpoints.api + 'ActividadesClientes';
    this.gestionesApiUrl = AppConfig.endpoints.api + 'ClienteGestiones';
    this.consumosApiUrl = AppConfig.endpoints.api + 'ClienteConsumos';
    this.reclamosApiUrl = AppConfig.endpoints.api + 'ClienteReclamos';
    this.cuentaCorrienteApiUrl = AppConfig.endpoints.api + 'ClienteCuentaCorriente';
    this.vendedoresApiUrl = AppConfig.endpoints.api + 'Vendedores';
  }

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

  public GetClientePotencial(clienteId: number): Observable<ClientePotencial> {
    const url = `${this.actividadesApiUrl}/GetClientePotencial/${clienteId}`;
    return this.httpClient.get<ClientePotencial>(url).pipe(
      tap(() => LoggerService.log('fetched GetGestiones')),
      catchError(this.handleError<ClientePotencial>('obtener el cliente.'))
    );
  }

  public getVendedores() {
    return this.httpClient.get<listable[]>(this.vendedoresApiUrl).pipe(
      tap(() => LoggerService.log('fetched GetVendedores')),
      catchError(this.handleError<listable[]>('GetVendedores'))
    );
  }

  //#region Gestiones
  public GetGestiones(clienteId: number): Observable<ClientesGestion[]> {
    const url = `${this.gestionesApiUrl}/${clienteId}`;
    return this.httpClient.get<ClientesGestion[]>(url).pipe(
      tap(() => LoggerService.log('fetched GetGestiones')),
      catchError(this.handleError<ClientesGestion[]>('obtener las Gestiones.'))
    );
  }

  GetGestionesGenerales(tipoFecha: number, desde: Date, hasta: Date, vendedor: string, clienteId: number, modoAdmin: Boolean )
  : Observable<ClientesGestion[]> {
    const params = new HttpParams()
      .set('tipoFecha', tipoFecha.toString())
      .set('desde', desde.toDateString())
      .set('hasta', hasta.toDateString())
      .set('vendedor', vendedor.toString())
      .set('modoAdmin', modoAdmin.toString());

    const url = `${this.gestionesApiUrl}/GetGestionesGenerales/${clienteId}`;
    return this.httpClient.get<ClientesGestion[]>(url, { params: params }).pipe(
      tap(() => LoggerService.log('fetched GetGestiones')),
      catchError(this.handleError<ClientesGestion[]>('obtener las Gestiones Generales.'))
    );
  }

  public GetGestion(id: number): Observable<ClientesGestion> {
    const url = `${this.gestionesApiUrl}/GetById/${id}`;
    return this.httpClient.get<ClientesGestion>(url).pipe(
      tap(() => LoggerService.log(`fetched ClientesGestion id=${id}`)),
      catchError(this.handleError<ClientesGestion>('obtener la Gestion'))
    );
  }

  public GetTiposGestion(): Observable<listable> {
    const url = `${this.gestionesApiUrl}/GetTiposGestion`;
    return this.httpClient.get<listable>(url).pipe(
      tap(() => LoggerService.log('fetched GetTiposGestion')),
      catchError(this.handleError<listable>('obtener los tipos de Gestion'))
    );
  }

  EliminarGestion(id: number) {
    const url = `${this.gestionesApiUrl}/${id}`;
    return this.httpClient.delete(url).pipe(
      tap(() => LoggerService.log('fetched EliminarGestion')),
      catchError(this.handleError('eliminar la Gestion'))
    );
  }

  public CreateClientesGestion(gestion: ClientesGestion) {
    const isNew = gestion.id == 0;
    const url = `${this.gestionesApiUrl}`;
    const body = JSON.stringify(gestion);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, body, { headers: headerOptions }).pipe(
      tap(() => {
        LoggerService.log('fetched CreateClientesGestion');
        this.showSnackBar(isNew ? 'Gestion creada' : 'Gestion actualizada');
      }),
      catchError(this.handleError<ClientesGestion>(isNew ? 'crear la Gestion' : 'actualizar la Gestion'))
    );
  }
  //#endregion

  //#region Consumos
  public GetConsumos(desde: Date, hasta: Date, vendedor: string, clienteId: number, modoAdmin: Boolean): Observable<ClienteConsumo[]> {

    const params = new HttpParams()
      .set('desde', desde.toDateString())
      .set('hasta', hasta.toDateString())
      .set('vendedor', vendedor.toString())
      .set('modoAdmin', modoAdmin.toString());

    const url = `${this.consumosApiUrl}/GetConsumos/${clienteId}`;
    return this.httpClient.get<ClienteConsumo[]>(url, { params: params }).pipe(
      tap(() => LoggerService.log('fetched GetConsumos')),
      catchError(this.handleError<ClienteConsumo[]>('obtener los Consumos.'))
    );
  }

  //#endregion

  //#region Reclamos
  public GetReclamos(desde: Date, hasta: Date, vendedor: string, clienteId: number, modoAdmin: Boolean): Observable<ClienteReclamo[]> {

    const params = new HttpParams()
      .set('desde', desde.toDateString())
      .set('hasta', hasta.toDateString())
      .set('vendedor', vendedor.toString())
      .set('modoAdmin', modoAdmin.toString());

    const url = `${this.reclamosApiUrl}/GetReclamos/${clienteId}`;
    return this.httpClient.get<ClienteReclamo[]>(url, { params: params }).pipe(
      tap(() => LoggerService.log('fetched GetReclamos')),
      catchError(this.handleError<ClienteReclamo[]>('obtener los Reclamos.'))
    );
  }
  //#endregion

  //#region CuentaCorriente
  public GetCuentaCorriente(clienteId: number): Observable<ClienteCuentaCorriente[]> {
    const url = `${this.cuentaCorrienteApiUrl}/GetCuentaCorriente/${clienteId}`;
    return this.httpClient.get<ClienteCuentaCorriente[]>(url).pipe(
      tap(() => LoggerService.log('fetched GetCuentaCorriente')),
      catchError(this.handleError<ClienteCuentaCorriente[]>('obtener la Cuenta Corriente.'))
    );
  }

  // public GetComprobante(nroComprobante: string) {
  //   const url = `${this.cuentaCorrienteApiUrl}/GetComprobante/${nroComprobante}`;
  //   return this.httpClient.get<any>(url).pipe(
  //     tap(() => LoggerService.log('fetched GetComprobante')),
  //     catchError(this.handleError<any>('obtener el comprobante.'))
  //   );
  public GetComprobante(documentoId: number, tipoComprobante: string) {
    const params = new HttpParams()
      .set('tipoComprobante', tipoComprobante);

    const url = `${this.cuentaCorrienteApiUrl}/GetComprobante/${documentoId}`;
    return this.httpClient.get(url, { params: params, responseType: 'blob' }).pipe(
      tap(() => LoggerService.log('fetched GetComprobante')),
      catchError(this.handleError<any>('obtener el comprobante.'))
    );
  }
  // public GetComprobante(nroComprobante: string) {
  //   const url = `${this.cuentaCorrienteApiUrl}/GetComprobante/${nroComprobante}`;
  //   this.httpClient.get(url, { responseType: 'blob' }).subscribe(blob => {
  //     saveAs(blob, 'SomeFileDownloadName.pdf', {
  //        type: 'application/pdf' // --> or whatever you need here
  //       });
  //      }
  //   );
  // }
  //#endregion


  private showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
