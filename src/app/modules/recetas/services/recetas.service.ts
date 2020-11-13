import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { AppConfig } from '../../../configs/app.config';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Listable } from '@app/models/listable.model';

import { NotificationService } from '../../core/services/notification.service';
import { CommonService } from '../../shared/services/common.service';
import { Recetas } from '../models/recetas.model';
import { ClientesRecetas } from '../models/clientes-recetas.model';

import { Medicamentos } from '../models/medicamentos.model';

@Injectable()
export class RecetasService {

  recetaApiUrl: string;
  // private http: Http,
  constructor(private httpClient: HttpClient,
    public snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private commonServices: CommonService) {
    this.recetaApiUrl = AppConfig.settings.endpoints.api + 'recetas';
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
        this.commonServices.showSnackBarFatal('Ha ocurrido un error al ' + operation);
      }

      return of(result as T);
    };
  }

  public GetRecetas(): Observable<Recetas[]> {
    // const params = new HttpParams()
    // .set('desde', desde.toDateString())
    // .set('hasta', hasta.toDateString());
    const url = `${this.recetaApiUrl}/GetRecetas`;
    return this.httpClient.get<Recetas[]>(url).pipe(
      // tap(() => LoggerService.log('fetched GetRecetas')),
      catchError(this.handleError<Recetas[]>('obtener las Recetas'))
    );
  }

  public GetRecetaByID(id: number): Observable<Recetas> {
    const url = `${this.recetaApiUrl}/GetRecetaByID/${id}`;
    return this.httpClient.get<Recetas>(url).pipe(
      // tap(() => LoggerService.log(`fetched receta id=${id}`)),
      catchError(this.handleError<Recetas>(`obtener la Receta`))
    );
  }

  GetPlanes(clienteId: number): Observable<Listable[]> {
    const url = `${this.recetaApiUrl}/GetPlanes/${clienteId}`;
    return this.httpClient.get<Listable[]>(url);
  }

  GetClientesRecetas() {
    const url = `${this.recetaApiUrl}/GetClientesRecetas`;
    return this.httpClient.get<ClientesRecetas[]>(url);
  }

  GetMedicamentosByName(nombre: string): Observable<Medicamentos[]>  {
    const url = `${this.recetaApiUrl}/GetMedicamentosByName/${nombre}`;
    return this.httpClient.get<Medicamentos[]>(url);
  }

  public GuardarReceta(receta: Recetas): Observable<any> {
    const isNew = receta.id == 0;
    const url = `${this.recetaApiUrl}/GuardarReceta`;
    const body = JSON.stringify(receta);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(url, body, { headers: headerOptions }).pipe(
      tap(() => {
        // LoggerService.log('fetched CreateReceta');
        this.commonServices.showSnackBarSucces(isNew ? 'Receta creada' : 'Receta actualizada');
      }) , catchError(
        this.handleError<any>(isNew ? 'Crear la Receta' : 'actualizar la Receta')
      )
    );
  }

  public GuardarRecetaV2(receta: Recetas): Observable<Recetas> {
    const isNew = receta.id == 0;
    const url = `${this.recetaApiUrl}/GuardarRecetaV2`;
    const body = JSON.stringify(receta);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<Recetas>(url, body, { headers: headerOptions }).pipe(
      tap(() => {
        // LoggerService.log('fetched CreateReceta');
        this.commonServices.showSnackBarSucces(isNew ? 'Receta creada' : 'Receta actualizada');
      }) , catchError(
        this.handleError<Recetas>(isNew ? 'Crear la Receta' : 'actualizar la Receta')
      )
    );
  }

  GenerearRecetaPdf(recetaId: number) {
    const url = `${this.recetaApiUrl}/GenerearRecetaPdf/${recetaId}`;
    return this.httpClient.get(url, { responseType: 'blob' }).pipe(
      tap(() => console.log('fetched GenerearRecetaPdf')),
    );
  }

  SendPrescriptionTo(recetaId: number, email: string): Observable<any> {
    const url = `${this.recetaApiUrl}/SendPrescriptionTo/${recetaId}/${email}`;
    return this.httpClient.get<any>(url);
  }

}
