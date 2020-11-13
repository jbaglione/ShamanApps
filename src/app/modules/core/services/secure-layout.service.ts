import { Injectable } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SecureLayoutService {
  private sidenavMenu: MatSidenav;
  private sidenavAlertas: MatSidenav;

  constructor() { }

  public setSidenavMenu(sidenav: MatSidenav): void {
    this.sidenavMenu = sidenav;
  }

  public OpenSidenavMenu(): Promise<MatDrawerToggleResult> {
    return this.sidenavMenu.open();
  }

  public CloseSidenavMenu(): Promise<MatDrawerToggleResult> {
    return this.sidenavMenu.close();
  }

  public setSidenavAlertas(sidenav: MatSidenav): void {
    this.sidenavAlertas = sidenav;
  }

  public OpenSidenavAlertas(): Promise<MatDrawerToggleResult> {
    return this.sidenavAlertas.open();
  }

  public CloseSidenavAlertas(): Promise<MatDrawerToggleResult> {
    return this.sidenavAlertas.close();
  }

}
