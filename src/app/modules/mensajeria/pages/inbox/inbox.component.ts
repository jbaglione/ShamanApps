import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MediaObserver } from '@angular/flex-layout';
import { Observable, BehaviorSubject } from 'rxjs';
import { elementAt } from 'rxjs/operators';
import { SecureLayoutService } from '@app/modules/core/services/secure-layout.service';
import { MensajesService, AlertasService } from '../../services/index';
import { MensajeItem, Mensaje } from '../../models/index';



@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  @ViewChild(MatSidenavContainer, {static: true}) matSidenavContainer: MatSidenavContainer ;
  private cargandoMensajes: BehaviorSubject<boolean>;
  public cargandoMensajes$: Observable<boolean>;
  cantidadAlertas$: Observable<number>;
  mensajesItems: MensajeItem [];
  mensajeSelected: Mensaje;

  constructor(
    public mediaObserver: MediaObserver,
    public router: Router,
    private mensajeriaService: MensajesService,
    private alertasService: AlertasService,
    private secureLayoutService: SecureLayoutService
  ) {
    this.cargandoMensajes =  new BehaviorSubject<boolean>(true);
    this.cargandoMensajes$ = this.cargandoMensajes.asObservable();
  }

  ngOnInit() {
    this.cantidadAlertas$ = this.alertasService.currentCantAlertas.pipe(elementAt(1));
    this.cantidadAlertas$.subscribe((cantidad: number) => {
      if (cantidad != 0) {
        this.secureLayoutService.OpenSidenavAlertas();
      }
      return cantidad;
    });
    this.getMensajesItems();
  }

  getMensajesItems() {
    this.cargandoMensajes.next(true);
    this.mensajeriaService
    .GetMensajesItems()
    .subscribe(data => {
        this.mensajesItems = data;
        this.cargandoMensajes.next(false);
      },
      error => {
        this.cargandoMensajes.next(false);
        throw error;
      });
  }

  setMensajeSelected($event) {
    let mensajeId = ($event as MensajeItem).id;

    if (this.mediaObserver.isActive('xs')) {
      this.router.navigate(['/mensajeria/mensaje-mobile', mensajeId]);
    } else {
      this.mensajeriaService
      .GetMensaje(mensajeId)
      .subscribe(data => {
        this.mensajeSelected = data;
        if (!this.mensajeSelected.leido) {
          this.mensajeriaService
            .SetLeido(this.mensajeSelected.id)
            .subscribe(result => {
              if (result) {
                let mi = this.mensajesItems.find(x => x.id == this.mensajeSelected.id);
                mi.leido = true;
              }
            });
        }
      });
    }
  }

  sortMensajesItems($event) {
  }

  refreshMensajesItems($event) {
  }
}
