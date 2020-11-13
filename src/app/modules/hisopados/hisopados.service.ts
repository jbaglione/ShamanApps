import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/configs/app.config';
import { Hisopado } from './models/hisopado.model';
import { CommonService } from '../shared/services/common.service';

@Injectable()
export class HisopadosService {

  operativaClientesApiUrl: string;
  // private http: Http,
  constructor(
    private httpClient: HttpClient,
    private commonServices: CommonService
  ) {
    this.operativaClientesApiUrl =
      AppConfig.settings.endpoints.api + 'Hisopados';
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

  getHisopados(desde: Date, hasta: Date): Observable<Hisopado[]> {
    const url = `${this.operativaClientesApiUrl}/Hisopados/Desde/${desde.toDateString()}/Hasta/${hasta.toDateString()}`;
    return this.httpClient.get<Hisopado[]>(url);
  }

  getInformeCovidPdf(incidenteId: number) {
      const url = `${this.operativaClientesApiUrl}/GetInformeCovidPdf/${incidenteId}`;
      return this.httpClient.get(url, { responseType: 'blob' });
    }

}
