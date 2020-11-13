import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs/app.config';
import { Observable, of, throwError as observableThrowError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Listable } from 'src/app/models/listable.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LocalidadItem } from './models/localidadItem';
import { CommonService } from '../shared/services/common.service';
import { ClienteInfo } from '../../models/clienteInfo';
import { DireccionFormateada } from './models/DireccionFormateada';
import { PreIncidentesServicios } from './models/preIncidentesServicios';

@Injectable()
export class PreIncidentesClientesService {

  mapaApiUrl: string;
  PreIncidentesClientesApiUrl: string;
  auditoresApiUrl: string;

  constructor(private httpClient: HttpClient,
              public snackBar: MatSnackBar,
              private commonServices: CommonService) {
    this.PreIncidentesClientesApiUrl = AppConfig.settings.endpoints.api + 'PreIncidentesServicios';
    this.mapaApiUrl = AppConfig.settings.endpoints.api + 'Mapa';
  }

  GetPreIncidentesGenerales(desde: Date, hasta: Date)
    : Observable<PreIncidentesServicios[]> {
    const params = new HttpParams()
      .set('desde', desde.toDateString())
      .set('hasta', hasta.toDateString());

    const url = `${this.PreIncidentesClientesApiUrl}/GetPreIncidentesGenerales`;
    return this.httpClient.get<PreIncidentesServicios[]>(url, { params });
  }

  GetPreIncidente(id: number): Observable<PreIncidentesServicios> {
    const url = `${this.PreIncidentesClientesApiUrl}/GetById/${id}`;
    return this.httpClient.get<PreIncidentesServicios>(url);
  }

  GetClienteInfo(): Observable<ClienteInfo> {
    const url = `${this.PreIncidentesClientesApiUrl}/GetClienteInfo`;
    return this.httpClient.get<ClienteInfo>(url);
  }

  GetLocalidades(): Observable<LocalidadItem[]> {
    const url = `${this.PreIncidentesClientesApiUrl}/GetLocalidades`;
    return this.httpClient.get<LocalidadItem[]>(url);
  }
  GetGradosOperativos(): Observable<Listable[]> {
    const url = `${this.PreIncidentesClientesApiUrl}/GetGradosOperativos`;
    return this.httpClient.get<Listable[]>(url);
  }

  GetPlanes(): Observable<Listable[]> {
    const url = `${this.PreIncidentesClientesApiUrl}/GetPlanes`;
    return this.httpClient.get<Listable[]>(url);
  }

  GuardarPreIncidente(auditoria: PreIncidentesServicios) {
    const isNew = auditoria.id === 0;
    const url = `${this.PreIncidentesClientesApiUrl}/GuardarPreIncidente`;
    const body = JSON.stringify(auditoria);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, body, { headers: headerOptions });
    // .pipe(
    //   tap(() => {
    //     this.commonServices.showSnackBarSucces(isNew ?
    // 'Su servicio ha sido registrado correctamente, en breves recibirá la aprobación o rechazo del mismo' : 'Servicio actualizado');
    //   })
    // );
  }

  FormatearFecha(direction: string): Observable<DireccionFormateada> {
    const url = `${this.mapaApiUrl}/FormatearFecha/${direction}`;
    return this.httpClient.get<DireccionFormateada>(url);
  }

}
