import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AppConfig } from 'src/app/configs/app.config';
import { Incidentes } from './models/incidentes';
import { LiquidacionesRechazado } from './models/liquidaciones-rechazado';
import { Listable, ListableNumber } from '@app/models/listable.model';
import { shareReplay } from 'rxjs/operators';
import { IncidenteDetalle } from './models/indidente-detalle.model';
import { Conformidad } from './models/conformidad.model';
import { MotivoReclamo } from './models/motivo-reclamo.model';
import { Resumen } from './models/resmune.model';
import { ResumenItemDetalle } from './models/resumen-item-detalle.model';
import { Asistencia } from './models/asistencia';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from '../core/services/notification.service';
import { ResumenHoras } from './models/resumen-horas.model';
import { ResultadoLaboratorio } from './models/resultado-hisopado.model';

@Injectable()
export class LiquidacionesService {

  liquidacionesApiUrl: string;
  // private http: Http,
  constructor(
    private httpClient: HttpClient,
    public snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {
    this.liquidacionesApiUrl =
      AppConfig.settings.endpoints.api + 'Liquidaciones';
  }

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

    GetLiquidacionesRealizados$(desde: Date, hasta: Date): Observable<Incidentes[]> {
      const url = `${this.liquidacionesApiUrl}/LiquidacionesRealizados/Desde/${desde.toDateString()}/Hasta/${hasta.toDateString()}`;
      return this.httpClient.get<Incidentes[]>(url);
    }

     GetLiquidacionesRechazados$(desde: Date, hasta: Date): Observable<LiquidacionesRechazado[]> {
      const url = `${this.liquidacionesApiUrl}/LiquidacionesRechazados/Desde/${desde.toDateString()}/Hasta/${hasta.toDateString()}`;
      return this.httpClient.get<LiquidacionesRechazado[]>(url);
    }

    getPeriodos(pEsEmpresa: boolean): Observable<Listable[]> {
      const url = `${this.liquidacionesApiUrl}/GetPeriodos/${pEsEmpresa}`;
      return this.httpClient.get<Listable[]>(url);
    }

    getMovilesEmpresas(pPer: string, pEst: string, pTip: string, pEsEmpresa: boolean): Observable<Listable[]> {
      const params = new HttpParams()
      .set('pPer', pPer)
      .set('pEst', pEst)
      .set('pTip', pTip)
      .set('pEsEmpresa', pEsEmpresa.toString());

      const url = `${this.liquidacionesApiUrl}/GetMovilesEmpresas`;
      return this.httpClient.get<Listable[]>(url, { params });
    }

    getIncidentes(pMov: string, pPer: string, pDia: string, pEst: string): Observable<Incidentes[]> {
      const params = new HttpParams()
      .set('pMov', pMov)
      .set('pPer', pPer)
      .set('pDia', pDia)
      .set('pEst', pEst);
      const url = `${this.liquidacionesApiUrl}/GetIncidentes`;
      return this.httpClient.get<Incidentes[]>(url, { params });
    }

    uploadOrdenServicio(ArchivoOrden: string, pLiqId: string, IncidenteId: string, file: string | Blob): Observable<Incidentes> {

      if (ArchivoOrden == null || ArchivoOrden == undefined || ArchivoOrden == 'null') {
        ArchivoOrden = '';
      }
      const formData: FormData = new FormData();
      formData.set('ArchivoOrden', ArchivoOrden);
      formData.set('pLiqId', pLiqId);
      formData.set('IncidenteId', IncidenteId);
      formData.append('files', file);

      const url = `${this.liquidacionesApiUrl}/UploadOrdenServicio`;
      return this.httpClient.post<Incidentes>(url, formData).pipe(
        catchError(this.handleError<Incidentes>('subir el archivo, intentelo mas tarde.'))
      );
    }

    eliminarOrdenServicio(incidenteId: string, archivoOrden: string): Observable<boolean> {
      const params = new HttpParams()
      .set('incidenteId', incidenteId)
      .set('archivoOrden', archivoOrden);

      const url = `${this.liquidacionesApiUrl}/DeleteOrden`;
      return this.httpClient.get<boolean>(url, { params });
    }

    getIncidenteDetalle(pItmLiq: string, pLiqId: string, pInc: string): Observable<IncidenteDetalle>  {
      const params = new HttpParams()
      .set('pItmLiq', pItmLiq)
      .set('pLiqId', pLiqId)
      .set('pInc', pInc);

      const url = `${this.liquidacionesApiUrl}/GetIncidenteDetalle`;
      return this.httpClient.get<IncidenteDetalle>(url, { params });
    }

    getConformidad(pItmLiq: string): Observable<Conformidad> {
      const url = `${this.liquidacionesApiUrl}/GetConformidad/${pItmLiq}`;
      return this.httpClient.get<Conformidad>(url);
    }

    getMotivosReclamos(): Observable<MotivoReclamo[]> {
      const url = `${this.liquidacionesApiUrl}/GetMotivosReclamos/`;
      return this.httpClient.get<MotivoReclamo[]>(url);
    }

    setRespuesta(pItm: string, pSta: number, pRta: string): Observable<boolean> {
      const formData: FormData = new FormData();
      formData.set('pItm', pItm);
      formData.set('pSta', pSta.toString());
      formData.set('pRta', pRta);

      const url = `${this.liquidacionesApiUrl}/SetRespuesta`;
      return this.httpClient.post<boolean>(url, formData);
    }

    setConformidad(pItm: string, pRpl: number, pCnf: number, pMot: number, pDifS: string,
      pLiqS: string, pNueS: string, pObs: string ): Observable<boolean> {
      const formData: FormData = new FormData();
      formData.set('pItm', pItm);
      formData.set('pRpl', pRpl.toString());
      formData.set('pCnf', pCnf.toString());
      formData.set('pMot', pMot?.toString());
      formData.set('pDifS', pDifS);
      formData.set('pLiqS', pLiqS);
      formData.set('pNueS', pNueS);
      formData.set('pObs', pObs);

      const url = `${this.liquidacionesApiUrl}/SetConformidad`;
      return this.httpClient.post<boolean>(url, formData);
    }

    reliquidar(pLiqId: string):  Observable<number> {
      const url = `${this.liquidacionesApiUrl}/Reliquidar/${pLiqId}`;
      return this.httpClient.get<number>(url);
    }

    getResumen(pMov: string): Observable<Resumen> {
      const url = `${this.liquidacionesApiUrl}/GetResumen/${pMov}`;
      return this.httpClient.get<Resumen>(url);
    }

    getResumenDetalle(pLiqId: string, pLiqMovId: number, link: number): Observable<ResumenItemDetalle[]> {
      const params = new HttpParams()
      .set('pLiqId', pLiqId)
      .set('pLiqMovId', pLiqMovId.toString())
      .set('link', link.toString());
      const url = `${this.liquidacionesApiUrl}/GetResumenDetalle`;
      return this.httpClient.get<ResumenItemDetalle[]>(url, { params });
    }

    getResumenHoras(pLiqMov: number): Observable<ResumenHoras[]> {
      const url = `${this.liquidacionesApiUrl}/GetResumenHoras/${pLiqMov}`;
      return this.httpClient.get<ResumenHoras[]>(url);
    }


    getAsistencia(pMov: string, pPer: string): Observable<Asistencia[]> {
      const params = new HttpParams()
      .set('pMov', pMov)
      .set('pPer', pPer);
      const url = `${this.liquidacionesApiUrl}/GetAsistencia`;
      return this.httpClient.get<Asistencia[]>(url, { params });
    }

    getMotivosNoRealizacion(): Observable<Listable[]> {
      const url = `${this.liquidacionesApiUrl}/GetMotivosNoRealizacion`;
      return this.httpClient.get<Listable[]>(url);
    }

    getLaboratorios(pItm: string): Observable<ListableNumber[]> {
      const url = `${this.liquidacionesApiUrl}/GetLaboratorios/${pItm}`;
      return this.httpClient.get<ListableNumber[]>(url);
    }

    setResultadoLaboratorio(resultadoLaboratorio: ResultadoLaboratorio): Observable<Incidentes> {
      const url = `${this.liquidacionesApiUrl}/SetResultadoLaboratorio`;
      const body = JSON.stringify(resultadoLaboratorio);
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.httpClient.post<Incidentes>(url, body, { headers: headerOptions });
    }

    showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.settings.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
