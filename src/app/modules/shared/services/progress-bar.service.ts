import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProgressBarService {

  private activar: BehaviorSubject<boolean>;
  public activar$: Observable<boolean>;

  private info: BehaviorSubject<string>;
  public info$: Observable<string>;

  constructor() {
    this.activar = new BehaviorSubject<boolean>(false);
    this.activar$ = this.activar.asObservable();
    this.info = new BehaviorSubject<string>('');
    this.info$ = this.info.asObservable();
  }

  activarProgressBar(info = '') {
    this.activar.next(true);
    this.info.next(info);
  }

  desactivarProgressBar() {
    this.activar.next(false);
    this.info.next('');
  }
}
