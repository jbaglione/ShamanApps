import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { catchError, tap } from 'rxjs/operators';
import { AppConfig } from '../../../configs/app.config';
import { Observable, of } from 'rxjs';
// import { LoggerService } from '../../services/logger.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Listable } from '@app/models/listable.model';
import { Adjunto } from '@app/models/adjunto.model';
import { NotificationService } from '../../core/services/notification.service';
import { CommonService } from '../../shared/services/common.service';
import { Recetas } from '../models/recetas.model';
import { ClientesRecetas } from '../models/clientes-recetas.model';
import { ClientesIntegrantes } from '../models/clientes-integrantes.model';

@Injectable()
export class ClientesIntegrantesService {


  clientesIntegrantesApiUrl: string;
  constructor(private httpClient: HttpClient,
    public snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private commonServices: CommonService) {
    this.clientesIntegrantesApiUrl = AppConfig.settings.endpoints.api + 'ClientesIntegrantes';

  }

  GetClienteIntegranteByCliNroAfiliado(clienteId: number, nroAfiliado: string):  Observable<ClientesIntegrantes> {
    const params = new HttpParams()
    .set('clienteId', clienteId.toString())
    .set('nroAfiliado', nroAfiliado);

    const url = `${this.clientesIntegrantesApiUrl}/GetClienteIntegranteByCliNroAfiliado`;
    return this.httpClient.get<ClientesIntegrantes>(url, { params });
  }


  GetByClienteId(clienteId: number, nroAfiliado: string, apellido: string, nombre: string, dni: string):
  Observable<ClientesIntegrantes[]>  {
    const params = new HttpParams()
    .set('clienteId', clienteId?.toString())
    .set('nroAfiliado', nroAfiliado ? nroAfiliado : '')
    .set('apellido', apellido ? apellido : '')
    .set('nombre', nombre ? nombre : '')
    .set('dni', dni ? dni : '');
    const url = `${this.clientesIntegrantesApiUrl}/GetByClienteId`;
    return this.httpClient.get<ClientesIntegrantes[]>(url, { params });
  }
}
