import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProgressBarService {

  private activar: BehaviorSubject<boolean>;
  public activar$: Observable<boolean>;

  constructor() {
    this.activar = new BehaviorSubject<boolean>(false);
    this.activar$ = this.activar.asObservable();
  }

  activarProgressBar() {
    this.activar.next(true);
  }

  desactivarProgressBar() {
    this.activar.next(false);
  }
}
