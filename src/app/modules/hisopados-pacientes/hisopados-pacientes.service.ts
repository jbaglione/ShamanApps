import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppConfig } from 'src/app/configs/app.config';
import { HisopadoPaciente } from './models/hisopado-paciente.model';
import { CommonService } from '../shared/services/common.service';
import { ConstanciaAtencionReq } from './models/constancia-atencion-req';

@Injectable()
export class HisopadosPacientesService {


  operativaClientesApiUrl: string;
  conferenceApiUrl: string;
  // private http: Http,
  constructor(
    private httpClient: HttpClient,
    private commonServices: CommonService
  ) {
      this.operativaClientesApiUrl = AppConfig.settings.endpoints.api + 'HisopadosPacientes';
      this.conferenceApiUrl = AppConfig.settings.endpoints.gestionApi + 'Conference';
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
        this.commonServices.showSnackBarFatal('Ha ocurrido un error al ' + operation);
      }

      return of(result as T);
    };
  }

  getHisopadosPacientes(desde: Date, hasta: Date): Observable<HisopadoPaciente[]> {
    const url = `${this.operativaClientesApiUrl}/HisopadosPacientes/Desde/${desde.toDateString()}/Hasta/${hasta.toDateString()}`;
    return this.httpClient.get<HisopadoPaciente[]>(url);
  }

  getInformeCovidPdf(incidenteId: number) {
      const url = `${this.operativaClientesApiUrl}/GetInformeCovidPdf/${incidenteId}`;
      return this.httpClient.get(url, { responseType: 'blob' });
    }

  downloadConstanciaAtencion(constanciaAtencionReq: ConstanciaAtencionReq): Observable<HttpResponse<Blob>> {
    const url = `${this.conferenceApiUrl}/DownloadConstanciaAtencion`;
    const body = JSON.stringify(constanciaAtencionReq);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<Blob>(url, body, { headers: headerOptions, observe: 'response', responseType: 'blob'  as 'json' });
  }
}
