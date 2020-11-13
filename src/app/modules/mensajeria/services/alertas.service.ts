import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Alerta } from '../models/alerta.model';
import { AppConfig } from '@app/configs/app.config';
import { NotificationService } from '@app/modules/core/services/notification.service';

@Injectable({
  providedIn: 'root'
})

export class AlertasService {

  mensajesApiUrl: string;
  private cantAlertas = new BehaviorSubject<number>(0);

  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService
  ) {
    this.mensajesApiUrl = AppConfig.settings.endpoints.api + 'Alertas';
  }

  get currentCantAlertas() {
    return this.cantAlertas.asObservable();
  }

  public GetAlertas(): Observable<Alerta[]> {
    const url = this.mensajesApiUrl;
    return this.httpClient.get<Alerta[]>(url).pipe(shareReplay());
  }

  public RefreshCantidadAlertas(): void {
    const url = `${this.mensajesApiUrl}/Cantidad`;
    this.httpClient.get<number>(url).pipe(
      map((cantidad: number) => {
        this.cantAlertas.next(cantidad);
        return cantidad;
      })
    ).subscribe();
  }

  public ShowAlertasByNotifications() {
    this.GetAlertas()
      .pipe(
        map((alertas: Alerta[]) => {
          alertas.forEach((alerta: Alerta) => {
            this.notificationService.showAlert(alerta.descripcion);
          });
        })
      )
      .subscribe();
  }
}
