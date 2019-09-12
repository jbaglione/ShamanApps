import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MatTableLoadingService {

  private activo: BehaviorSubject<boolean>;
  public activo$: Observable<boolean>;

  constructor() {
    this.activo = new BehaviorSubject<boolean>(false);
    this.activo$ = this.activo.asObservable();
  }

  activar() {
    this.activo.next(true);
  }

  desactivar() {
    this.activo.next(false);
  }
}
