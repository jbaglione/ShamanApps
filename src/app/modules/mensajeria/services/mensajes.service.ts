import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { AppConfig } from '@app/configs/app.config';
import { MensajeItem } from '../models/mensaje-item.model';
import { Mensaje } from '../models/mensaje.model';

@Injectable({
  providedIn: 'root'
})

export class MensajesService {

  mensajesApiUrl: string;
  private cantMensajesPendientes = new BehaviorSubject<number>(0);
  private cantMensajes = new BehaviorSubject<number>(0);

  constructor(private httpClient: HttpClient) {
    this.mensajesApiUrl = AppConfig.settings.endpoints.api + 'Mensajes';
  }

  get currentCantMensjesPendientes() {
    return this.cantMensajesPendientes.asObservable();
  }

  get currentCantMensjes() {
    return this.cantMensajes.asObservable();
  }

  public GetMensajesItems(): Observable<MensajeItem[]> {
    const url = this.mensajesApiUrl;
    return this.httpClient.get<MensajeItem[]>(url).pipe(
      map((mensajesItem: MensajeItem[]) => {
        let canMensajes = mensajesItem == null ? 0 : mensajesItem.length;
        this.cantMensajes.next(canMensajes);
        return mensajesItem;
      })
    );
  }

  public GetMensaje(id: number): Observable<Mensaje> {
    const url = `${this.mensajesApiUrl}/${id}`;
    return this.httpClient.get<Mensaje>(url).pipe(shareReplay());
  }

  public RefreshCantidadMensajesPendientes(): void {
    const url = `${this.mensajesApiUrl}/CantidadPendientes`;
    this.httpClient.get<number>(url).pipe(
      map((cantidad: number) => {
        this.cantMensajesPendientes.next(cantidad);
        return cantidad;
      })
    ).subscribe();
  }

  public SetLeido(id: number): Observable<boolean> {
    const url = `${this.mensajesApiUrl}/${id}/Leido`;
    return this.httpClient.post<boolean>(url, null).pipe(
      map((leiod: boolean) => {
        this.cantMensajesPendientes.next(this.cantMensajesPendientes.value - 1);
        return leiod;
      })
    );
  }
}
