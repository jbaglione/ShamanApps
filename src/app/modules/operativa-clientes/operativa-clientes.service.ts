import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AppConfig } from 'src/app/configs/app.config';
import { Electro } from './models/electro.model';

@Injectable()
export class OperativaClientesService {
  operativaClientesApiUrl: string;
  // private http: Http,
  constructor(
    private httpClient: HttpClient,
    public snackBar: MatSnackBar
  ) {
    this.operativaClientesApiUrl =
      AppConfig.endpoints.api + 'OperativaClientes';
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

  //#region Electros
  public GetElectros$(desde: Date, hasta: Date): Observable<Electro[]> {
    const url = `${this.operativaClientesApiUrl}/Electros/Desde/${desde.toDateString()}/Hasta/${hasta.toDateString()}`;
    return this.httpClient.get<Electro[]>(url);
  }

  //#endregion

  private showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
