import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs/app.config';
import { Observable, of, throwError as observableThrowError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ClientesGestion } from 'src/app/models/clientes-gestion';
import { Listable } from 'src/app/models/listable.model';
import { ClienteConsumo } from 'src/app/models/cliente-consumo';
import { ClientePotencial } from 'src/app/models/cliente-potencial.model';
import { ClienteReclamo } from 'src/app/models/cliente-reclamo';
import { ClienteCuentaCorriente } from 'src/app/models/cliente-cuentacorriente';
import { NotificationService } from '../core/services/notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ActividadesClientesService {

  actividadesApiUrl: string;
  gestionesApiUrl: string;
  consumosApiUrl: string;
  reclamosApiUrl: string;
  cuentaCorrienteApiUrl: string;
  vendedoresApiUrl: string;

  clienteName: string;

  constructor(private httpClient: HttpClient, public notificationService: NotificationService) {
    this.actividadesApiUrl = AppConfig.settings.endpoints.api + 'ActividadesClientes';
    this.gestionesApiUrl = AppConfig.settings.endpoints.api + 'ClienteGestiones';
    this.consumosApiUrl = AppConfig.settings.endpoints.api + 'ClienteConsumos';
    this.reclamosApiUrl = AppConfig.settings.endpoints.api + 'ClienteReclamos';
    this.cuentaCorrienteApiUrl = AppConfig.settings.endpoints.api + 'ClienteCuentaCorriente';
    this.vendedoresApiUrl = AppConfig.settings.endpoints.api + 'Vendedores';
  }

  public GetClientePotencial(clienteId: number): Observable<ClientePotencial> {
    const url = `${this.actividadesApiUrl}/GetClientePotencial/${clienteId}`;
    return this.httpClient.get<ClientePotencial>(url).pipe(
      tap(() => console.log('fetched GetGestiones')),
    );
  }

  //#region Gestiones
  public GetGestiones(clienteId: number): Observable<ClientesGestion[]> {
    const url = `${this.gestionesApiUrl}/${clienteId}`;
    return this.httpClient.get<ClientesGestion[]>(url).pipe(
      tap(() => console.log('fetched GetGestiones')),
    );
  }

  GetGestionesGenerales(tipoFecha: number, desde: Date, hasta: Date, vendedor: string, clienteId: number, modoAdmin: Boolean )
  : Observable<ClientesGestion[]> {
    const params = new HttpParams()
      .set('tipoFecha', tipoFecha.toString())
      .set('desde', desde.toDateString())
      .set('hasta', hasta.toDateString())
      .set('vendedor', vendedor.toString())
      .set('modoAdmin', modoAdmin.toString());

    const url = `${this.gestionesApiUrl}/GetGestionesGenerales/${clienteId}`;
    return this.httpClient.get<ClientesGestion[]>(url, { params: params }).pipe(
      tap(() => console.log('fetched GetGestiones')),
    );
  }

  public GetGestion(id: number): Observable<ClientesGestion> {
    const url = `${this.gestionesApiUrl}/GetById/${id}`;
    return this.httpClient.get<ClientesGestion>(url).pipe(
      tap(() => console.log(`fetched ClientesGestion id=${id}`)),
    );
  }

  public GetTiposGestion(): Observable<Listable> {
    const url = `${this.gestionesApiUrl}/GetTiposGestion`;
    return this.httpClient.get<Listable>(url).pipe(
      tap(() => console.log('fetched GetTiposGestion')),
    );
  }

  EliminarGestion(id: number) {
    const url = `${this.gestionesApiUrl}/${id}`;
    return this.httpClient.delete(url).pipe(
      tap(() => console.log('fetched EliminarGestion')),
    );
  }

  public CreateClientesGestion(gestion: ClientesGestion) {
    const isNew = gestion.id == 0;
    const url = `${this.gestionesApiUrl}`;
    const body = JSON.stringify(gestion);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, body, { headers: headerOptions }).pipe(
      tap(() => {
        console.log('fetched CreateClientesGestion');
        this.notificationService.showSuccess(isNew ? 'Gestion creada' : 'Gestion actualizada');
      })
    );
  }
  //#endregion

  //#region Consumos
  public GetConsumos(desde: Date, hasta: Date, vendedor: string, clienteId: number, modoAdmin: boolean): Observable<ClienteConsumo[]> {

    const params = new HttpParams()
      .set('desde', desde.toDateString())
      .set('hasta', hasta.toDateString())
      .set('vendedor', vendedor.toString())
      .set('modoAdmin', modoAdmin.toString());

    const url = `${this.consumosApiUrl}/GetConsumos/${clienteId}`;
    return this.httpClient.get<ClienteConsumo[]>(url, { params: params }).pipe(
      tap(() => console.log('fetched GetConsumos')),
    );
  }

  //#endregion

  //#region Reclamos
  public GetReclamos(desde: Date, hasta: Date, vendedor: string, clienteId: number, modoAdmin: Boolean): Observable<ClienteReclamo[]> {

    const params = new HttpParams()
      .set('desde', desde.toDateString())
      .set('hasta', hasta.toDateString())
      .set('vendedor', vendedor.toString())
      .set('modoAdmin', modoAdmin.toString());

    const url = `${this.reclamosApiUrl}/GetReclamos/${clienteId}`;
    return this.httpClient.get<ClienteReclamo[]>(url, { params: params }).pipe(
      tap(() => console.log('fetched GetReclamos')),
    );
  }
  //#endregion

  //#region CuentaCorriente
  public GetCuentaCorriente(clienteId: number): Observable<ClienteCuentaCorriente[]> {
    const url = `${this.cuentaCorrienteApiUrl}/GetCuentaCorriente/${clienteId}`;
    return this.httpClient.get<ClienteCuentaCorriente[]>(url).pipe(
      tap(() => console.log('fetched GetCuentaCorriente')),
    );
  }

  public GetComprobante(documentoId: number, tipoComprobante: string) {
    const params = new HttpParams()
      .set('tipoComprobante', tipoComprobante);

    const url = `${this.cuentaCorrienteApiUrl}/GetComprobante/${documentoId}`;
    return this.httpClient.get(url, { params: params, responseType: 'blob' }).pipe(
      tap(() => console.log('fetched GetComprobante')),
    );
  }
  //#endregion
}
