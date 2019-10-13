import { Injectable } from '@angular/core';

import { tap, shareReplay } from 'rxjs/operators';
import { AppConfig } from '../../configs/app.config';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { listable } from 'src/app/models/listable.model';
import { ClientePotencial } from 'src/app/models/cliente-potencial.model';
import { NotificationService } from '../core/services/notification.service';

@Injectable()
export class AfiliacionesService {
  pamiUrl: string;
  afiliacionesApiUrl: string;
  vendedoresApiUrl: string;

  constructor(private httpClient: HttpClient, public notificationService: NotificationService) {
    this.afiliacionesApiUrl = AppConfig.endpoints.api + 'Afiliaciones';
    this.pamiUrl = AppConfig.endpoints.pami;
    this.tituloAfiliacionSubject = new BehaviorSubject<string>('Afiliaciones');
    this.tituloAfiliacion = this.tituloAfiliacionSubject.asObservable();
  }

  public tituloAfiliacion: Observable<string>;
  private tituloAfiliacionSubject: BehaviorSubject<string>;

  setTitulo(newTitle: string) {
    this.tituloAfiliacionSubject.next(newTitle);
  }

  getClientePotencial(
    tipoCliente: string,
    vendedor: string
  ): Observable<ClientePotencial[]> {
    const url = `${this.afiliacionesApiUrl}`;
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      TipoCliente: `${tipoCliente}`,
      Vendedor: `${vendedor}`
    });
    return this.httpClient
      .get<ClientePotencial[]>(url, { headers: headerOptions })
      .pipe(
        shareReplay(),
        tap(() => console.log('fetched GetClientePotencial'))
      );
  }

  getContrato(clienteId: number) {
    const url = `${this.afiliacionesApiUrl}/GetContrato`;
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      ClienteId: `${clienteId}`
    });
    return this.httpClient.get<any>(url, { headers: headerOptions }).pipe(
      shareReplay(),
       tap(() => console.log('fetched getContrato'))
    );
  }

  getMotivosSuspension() {
    const url = `${this.afiliacionesApiUrl}/GetMotivosSuspension`;
    return this.httpClient.get<listable[]>(url).pipe(
      shareReplay(),
      tap(() => console.log('fetched getMotivosSuspension'))
    );
  }

  guardarPotencialExito(clientePotencial: ClientePotencial) {
    const url = `${this.afiliacionesApiUrl}/GuardarPotencialExito`;
    const body = JSON.stringify(clientePotencial);
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.post(url, body, { headers: headerOptions }).pipe(
      shareReplay(),
      tap(() => {
        console.log('fetched guardarPotencialExito');
        this.notificationService.showSuccess('Potencial de Exito actualizado.');
      })
    );
  }
}
