import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AppConfig } from 'src/app/configs/app.config';
import { PanelOperativo } from './models/panel-operativo.model';
import { shareReplay } from 'rxjs/operators';
import { IncidentesViajes } from './models/incidentes-viajes.model';
import { MovilesSugerencias } from './models/moviles-sugerencias.model';

@Injectable()
export class PanelOperativoService {



  panelOperativoApiUrl: string;
  // private http: Http,
  constructor(
    private httpClient: HttpClient,
    public snackBar: MatSnackBar
  ) {
    this.panelOperativoApiUrl =
      AppConfig.endpoints.apiShaman + 'gruposoperativos';
  }

  private handleError<T>(
    operation = 'operation',
    result?: T,
    showMessage: boolean = true
  ) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      // LoggerService.log(`${operation} failed: ${error.message}`);

      if (error.status >= 500) {
        throw error;
      }

      if (showMessage) {
        this.showSnackBar('Ha ocurrido un error al ' + operation);
      }

      return of(result as T);
    };
  }

  public GetPanelOperativo$(): Observable<PanelOperativo[]> {
    const url = `${this.panelOperativoApiUrl}/PanelOperativo`;
    return this.httpClient.get<PanelOperativo[]>(url);
  }

  public GetLastSuceso$(viajeId: number): Observable<string> {
    const url = `${this.panelOperativoApiUrl}/GetLastSuceso/${viajeId}`;
    return this.httpClient.get<string>(url);
  }

  public GetViaje$(viajeId: number): Observable<IncidentesViajes> {
    const url = `${this.panelOperativoApiUrl}/GetViaje/${viajeId}`;
    return this.httpClient.get<IncidentesViajes>(url);
  }

  public GetSugerenciaDespacho$(pDespachar: number, pGdo: number, pLoc: number, pCli: number, pCliIte: number,
                                pLatitud: number, pLongitud: number, pFlgGeoEmpresas: boolean): Observable<MovilesSugerencias[]> {
    const params = new HttpParams()
      .set('pDespachar', pDespachar.toString())
      .set('pGdo', pGdo.toString())
      .set('pLoc', pLoc.toString())
      .set('pCli', pCli.toString())
      .set('pCliIte', pCliIte.toString())
      .set('pLatitud', pLatitud.toString())
      .set('pLongitud', pLongitud.toString())
      .set('pGeoEmp', pFlgGeoEmpresas.toString());

    const url = `${this.panelOperativoApiUrl}/GetSugerenciaDespacho`;
    return this.httpClient.get<MovilesSugerencias[]>(url, { params });
  }

  public GetDistanciaTiempo(latMov: string, lngMov: string, latDst: string, lngDst: string,
                            pForLiq: boolean, pUseSql: boolean): Observable<string> {
    const params = new HttpParams()
      .set('latMov', latMov)
      .set('lngMov', lngMov)
      .set('latDst', latDst)
      .set('lngDst', lngDst)
      .set('pForLiq', pForLiq.toString())
      .set('pUseSql', pUseSql.toString());

    const url = `${this.panelOperativoApiUrl}/GetDistanciaTiempo`;
    return this.httpClient.get<string>(url, { params });
  }

  private showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
