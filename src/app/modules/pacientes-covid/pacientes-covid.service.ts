import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/configs/app.config';
import { CommonService } from '../shared/services/common.service';
import { PacienteCovid } from './models/pacientes-covid.model';

@Injectable()
export class PacientesCovidService {
  operativaClientesApiUrl: string;
  // private http: Http,
  constructor(
    private httpClient: HttpClient,
    private commonServices: CommonService
  ) {
    this.operativaClientesApiUrl =
      AppConfig.settings.endpoints.api + 'Pacientes';
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

  public GetPacientesCovid(desde: Date, hasta: Date): Observable<PacienteCovid[]> {
    const url = `${this.operativaClientesApiUrl}/PacientesCovid/Desde/${desde.toDateString()}/Hasta/${hasta.toDateString()}`;
    return this.httpClient.get<PacienteCovid[]>(url);
  }

  public SendNotificacionUsuarioByIncidenteId(incidenteId: string): Observable<boolean> {
    const url = `${this.operativaClientesApiUrl}/SendNotificacionUsuarioByIncidenteId/IncidenteId/${incidenteId}`;
    return this.httpClient.post<boolean>(url, null);
  }

}
