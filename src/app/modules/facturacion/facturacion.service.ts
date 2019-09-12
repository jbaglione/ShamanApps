import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AppConfig } from 'src/app/configs/app.config';
import { Comprobante } from './models/comprobante';
import { ComprobanteServicio } from './models/comprobante-servicio';
import { ServicioRenglon } from './models/comprobante-servicio-renglon';
import { LoggerService } from '@app/services/logger.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class FacturacionService {
  facturacionApiUrl: string;
  // private http: Http,
  constructor(
    private httpClient: HttpClient,
    public snackBar: MatSnackBar
  ) {
    this.facturacionApiUrl =
      AppConfig.endpoints.api + 'Facturacion';
  }

  private handleError<T>(
    operation = 'operation',
    result?: T,
    showMessage: boolean = true
  ) {
    return (error: any): Observable<T> => {
      if (error.status >= 500) {
        throw error;
      }

      if (showMessage) {
        this.showSnackBar('Ha ocurrido un error al ' + operation);
      }
      return of(result as T);
    };
  }

  public getComprobantes(): Observable<Comprobante[]> {
    const url = `${this.facturacionApiUrl}/GetComprobantes`;
    return this.httpClient.get<Comprobante[]>(url).pipe(
      tap(() => LoggerService.log('fetched GetTiposGestion')),
      catchError(this.handleError<Comprobante[]>('obtener los tipos de Gestion'))
    );
  }

  getComprobanteServicios(comprobanteId: number): Observable<ComprobanteServicio[]> {
    const url = `${this.facturacionApiUrl}/GetComprobanteServicios/${comprobanteId}`;
    return this.httpClient.get<ComprobanteServicio[]>(url).pipe(
      tap(() => LoggerService.log(`fetched GetComprobanteServicios id=${comprobanteId}`)),
      catchError(this.handleError<ComprobanteServicio[]>('obtener los Servicios'))
    );
  }

  // getRenglones(comprobanteId: string, comprobanteId: string): Observable<ComprobanteServicioRenglon[]> {
  //   const url = `${this.facturacionApiUrl}/FacturacionRechazados/Desde/${desde.toDateString()}/Hasta/${hasta.toDateString()}`;
  //   return this.httpClient.get<ComprobanteServicioRenglon[]>(url);
  // }

  getRenglones(comprobanteId: number, servicioId: number): Observable<ServicioRenglon[]> {
    const url = `${this.facturacionApiUrl}/GetServicioRenglon/${comprobanteId}/${servicioId}`;
    return this.httpClient.get<ServicioRenglon[]>(url).pipe(
      tap(() => LoggerService.log(`fetched GetServicioRenglon comprobanteId=${comprobanteId}, servicioId=${servicioId}`)),
      catchError(this.handleError<ServicioRenglon[]>('obtener los Renglones'))
    );
  }

  public getComprobantePdf(documentoId: number) {
    const url = `${this.facturacionApiUrl}/GetComprobantePdf/${documentoId}`;
    return this.httpClient.get(url, { responseType: 'blob' }).pipe(
      tap(() => LoggerService.log('fetched GetComprobante')),
      catchError(this.handleError<any>('obtener el comprobante.'))
    );
  }

  showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
