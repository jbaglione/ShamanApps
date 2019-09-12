import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationCancel, NavigationError, NavigationEnd } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { CommonService } from '@app/services/common.service';
import { Usuario, GrupoAccesosMicrositios } from '@app/modules/security/models';
import { ProgressBarService } from '@app/modules/shared/services/progress-bar.service';
import { MatSidenav } from '@angular/material';


@Component({
  selector: 'app-secure-layout',
  templateUrl: './secure-layout.component.html',
  styleUrls: ['./secure-layout.component.css']
})

export class SecureLayoutComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav, {static: true}) sidenav: MatSidenav;
  private tituloRef: Subscription = null;
  private currentUserRef: Subscription = null;
  over = 'over';
  user: Usuario;
  titulo: string;
  grupoAccesosMicrositios: Observable<GrupoAccesosMicrositios[]>;

  constructor(
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    public progressBarService: ProgressBarService,
    private router: Router
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
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

  ngOnInit(): void {
    this.tituloRef = this.commonService.titulo.subscribe(currentTitulo => {
      this.titulo = currentTitulo;
    });
    this.currentUserRef = this.authenticationService.currentUser$.subscribe(userLoged => {
        this.user = userLoged;
      }
    );
    this.grupoAccesosMicrositios = this.authenticationService.getGruposMicrositios();
  }

  ngOnDestroy(): void {
    this.tituloRef.unsubscribe();
    if (this.tituloRef != null) {
      this.currentUserRef.unsubscribe();
    }
  }

  goToPage(urlPage: string, pageId: string ): void {
    this.sidenav.close();
    this.authenticationService.setCurrentPageId(parseInt(pageId));
    this.router.navigateByUrl(urlPage);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
