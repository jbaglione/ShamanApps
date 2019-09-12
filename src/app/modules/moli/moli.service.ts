import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AppConfig } from 'src/app/configs/app.config';
import { MoliRealizado } from './models/moli-realizado';
import { MoliRechazado } from './models/moli-rechazado';

@Injectable()
export class MoliService {
  moliApiUrl: string;
  // private http: Http,
  constructor(
    private httpClient: HttpClient,
    public snackBar: MatSnackBar
  ) {
    this.moliApiUrl =
      AppConfig.endpoints.api + 'Moli';
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

    GetMoliRealizados$(desde: Date, hasta: Date): Observable<MoliRealizado[]> {
      const url = `${this.moliApiUrl}/MoliRealizados/Desde/${desde.toDateString()}/Hasta/${hasta.toDateString()}`;
      return this.httpClient.get<MoliRealizado[]>(url);
    }

     GetMoliRechazados$(desde: Date, hasta: Date): Observable<MoliRechazado[]> {
      const url = `${this.moliApiUrl}/MoliRechazados/Desde/${desde.toDateString()}/Hasta/${hasta.toDateString()}`;
      return this.httpClient.get<MoliRechazado[]>(url);
    }


    showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
