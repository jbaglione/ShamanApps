
import { Injectable } from '@angular/core';

import { catchError, tap } from 'rxjs/operators';
import { AppConfig } from '../../configs/app.config';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoggerService } from '../../services/logger.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { listable } from 'src/app/models/listable.model';
import { ClientePotencial } from 'src/app/models/cliente-potencial.model';

@Injectable()
export class AfiliacionesService {
  pamiUrl: string;
  afiliacionesApiUrl: string;
  vendedoresApiUrl: string;

  constructor(private httpClient: HttpClient, public snackBar: MatSnackBar) {
    this.afiliacionesApiUrl = AppConfig.endpoints.api + 'Afiliaciones';
    this.pamiUrl = AppConfig.endpoints.pami;
    this.tituloAfiliacionSubject = new BehaviorSubject<string>('Afiliaciones');
    this.tituloAfiliacion = this.tituloAfiliacionSubject.asObservable();
    this.vendedoresApiUrl = AppConfig.endpoints.api + 'Vendedores';
  }

    public tituloAfiliacion: Observable<string>;
    private tituloAfiliacionSubject: BehaviorSubject<string>;

    private static handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // TODO: better job of transforming error for user consumption
            LoggerService.log(`${operation} failed: ${error.message}`);
            if (error.status >= 500) {
                throw error;
            }
            return of(result as T);
        };
    }

    setTitulo(newTitle: string) {
        this.tituloAfiliacionSubject.next(newTitle);
    }

    getClientePotencial(tipoCliente: string, vendedor: string): Observable<ClientePotencial[]> {
        const url = `${this.afiliacionesApiUrl}`;
        const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json',
                                                'TipoCliente': `${tipoCliente}`,
                                                'Vendedor': `${vendedor}` });
        return this.httpClient.get<ClientePotencial[]>(url, { headers: headerOptions }).pipe(
            tap(() => LoggerService.log('fetched GetClientePotencial')),
            catchError(AfiliacionesService.handleError<ClientePotencial[]>('GetClientePotencial'))
        );
    }

    getVendedores() {
        return this.httpClient.get<listable[]>(this.vendedoresApiUrl).pipe(
            tap(() => LoggerService.log('fetched GetVendedores')),
            catchError(AfiliacionesService.handleError<listable[]>('GetVendedores'))
        );
    }

    getContrato(clienteId: number) {
        const url = `${this.afiliacionesApiUrl}/GetContrato`;
        const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json', 'ClienteId': `${clienteId}` });
        return this.httpClient.get<any>(url, { headers: headerOptions }).pipe(
            tap(() => LoggerService.log('fetched getContrato')),
            catchError(AfiliacionesService.handleError<any>('getContrato'))
        );
    }


  getMotivosSuspension() {
    const url = `${this.afiliacionesApiUrl}/GetMotivosSuspension`;
    return this.httpClient.get<listable[]>(url).pipe(
        tap(() => LoggerService.log('fetched getMotivosSuspension')),
        catchError(AfiliacionesService.handleError<listable[]>('getMotivosSuspension'))
    );
  }

  guardarPotencialExito(clientePotencial: ClientePotencial) {
    const url = `${this.afiliacionesApiUrl}/GuardarPotencialExito`;
    const body = JSON.stringify(clientePotencial);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, body, { headers: headerOptions }).pipe(
      tap(() => {
        LoggerService.log('fetched guardarPotencialExito');
        this.showSnackBar('Potencial de Exito actualizado.');
      }),
      catchError(AfiliacionesService.handleError<ClientePotencial>('Potencial de Exito actualizado.'))
    );
  }

  private showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
