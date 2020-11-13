import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  Router,
  RouterEvent,
  NavigationStart,
  NavigationCancel,
  NavigationError,
  NavigationEnd,
  ActivatedRoute
} from '@angular/router';
import { Subscription, Observable, fromEvent } from 'rxjs';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { Usuario, GrupoAccesosMicrositios } from '@app/modules/security/models';
import { ProgressBarService } from '@app/modules/shared/services/progress-bar.service';
import { MatSidenav } from '@angular/material/sidenav';
import { VendedorService } from '@app/modules/shared/services/vendedor.service';
import { MensajesService } from '@app/modules/mensajeria/services/mensajes.service';
import { AlertasService } from '@app/modules/mensajeria/services/alertas.service';
import { SecureLayoutService } from '../../services/secure-layout.service';

@Component({
  selector: 'app-secure-layout',
  templateUrl: './secure-layout.component.html',
  styleUrls: ['./secure-layout.component.scss']
})

export class SecureLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('snav', { static: true }) sidenav: MatSidenav;
  @ViewChild('snavAlertas', { static: true }) snavAlertas: MatSidenav;

  private tituloRef: Subscription = null;
  userName$: Observable<string>;
  cantidadMensajesPendientes$: Observable<number>;
  cantidadAlertas$: Observable<number>;

  private currentUserRef: Subscription = null;
  over = 'over';
  user: Usuario;
  titulo: string;
  grupoAccesosMicrositios: Observable<GrupoAccesosMicrositios[]>;
  flag = true;

  constructor(
    private authenticationService: AuthenticationService,
    public progressBarService: ProgressBarService,
    public vendedorService: VendedorService,
    private router: Router,
    private mensajeservice: MensajesService,
    private alertasService: AlertasService,
    private secureLayoutService: SecureLayoutService
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit(): void {
    this.secureLayoutService.setSidenavMenu(this.sidenav);
    this.secureLayoutService.setSidenavAlertas(this.snavAlertas);
    this.userName$ = this.authenticationService.currentUserName;
    this.cantidadMensajesPendientes$ = this.mensajeservice.currentCantMensjesPendientes;
    this.cantidadAlertas$ = this.alertasService.currentCantAlertas;
    this.grupoAccesosMicrositios = this.authenticationService.getGruposMicrositios();
    this.mensajeservice.RefreshCantidadMensajesPendientes();
    this.alertasService.RefreshCantidadAlertas();
  }

  ngOnDestroy(): void {
    if (this.tituloRef != null) {
      this.tituloRef.unsubscribe();
    }
    if (this.currentUserRef != null) {
      this.currentUserRef.unsubscribe();
    }
  }

  goToPage(urlPage: string, pageId: string): void {
    this.sidenav.close();
    this.authenticationService.currentPageId = parseInt(pageId);
    this.router.navigateByUrl(urlPage);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  showMessages() {
    this.router.navigateByUrl('/mensajeria/mensajes');
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.progressBarService.activarProgressBar();
    }
    if (event instanceof NavigationEnd) {
      this.progressBarService.desactivarProgressBar();
    }
    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.progressBarService.desactivarProgressBar();
    }
    if (event instanceof NavigationError) {
      this.progressBarService.desactivarProgressBar();
    }
  }
}
