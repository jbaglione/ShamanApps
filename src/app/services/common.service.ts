import { Injectable } from '@angular/core';
import { AppConfig } from '../configs/app.config';

import {BehaviorSubject, Observable, of, throwError as observableThrowError } from 'rxjs';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommonService {
  public titulo: Observable<string>;
  private tituloSubject: BehaviorSubject<string>;

  constructor(public snackBar: MatSnackBar, private httpClient: HttpClient) {
    // Mantiene el ultimo titulo usado.
    this.tituloSubject = new BehaviorSubject<string>(localStorage.getItem('currentTitle'));
    this.titulo = this.tituloSubject.asObservable();
  }

  public setTitulo(newTitle) {
    localStorage.setItem('currentTitle', newTitle);
    this.tituloSubject.next(newTitle);
  }

  public showSnackBar(name): void {
      const config: any = new MatSnackBarConfig();
      config.duration = AppConfig.snackBarDuration;
      this.snackBar.open(name, 'OK', config);
    }
  public showSnackBarFatal(name): void {
      const config: MatSnackBarConfig = new MatSnackBarConfig();
      config.duration = AppConfig.snackBarDuration;
      config.verticalPosition = 'top';
      config.panelClass = ['warn-bg'];
      this.snackBar.open(name, '', config);
    }

  public createGetRequets(data: string[]) {
    const getRequests = [];
    data.forEach(url =>
      getRequests.push(
        this.httpClient.get(url, { responseType: 'blob' })
      )
    );
    return getRequests;
  }
}
