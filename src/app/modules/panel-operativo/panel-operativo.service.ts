import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AppConfig } from 'src/app/configs/app.config';
import { PanelOperativo } from './models/panel-operativo.model';
import { shareReplay } from 'rxjs/operators';

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

  private showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
