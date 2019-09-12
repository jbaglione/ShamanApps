import { AuthenticationService } from './../../security/authentication.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfig } from '../../../configs/app.config';

@Component({
  selector: 'app-afiliaciones-detail',
  templateUrl: './afiliaciones-detail.component.html',
  styleUrls: ['./afiliaciones-detail.component.css']
})
export class AfiliacionesDetailComponent implements OnInit {

  url_1: string = AppConfig.endpoints.oldExranet + 'afiliacionesPopUp?GetDirectClienteId=';
  url_2 = '&GetDirectSolicitud=true';
  url_3 = '&Acceso=';
  url_4 = '&Estado=';
  url_5 = '&token=';
  urlFinal: string;
  constructor(
    public dialogRef: MatDialogRef<AfiliacionesDetailComponent>,
    authenticationService: AuthenticationService,
     @Inject(MAT_DIALOG_DATA) public data: AfiliacionesDialogData
  ) {

    this.urlFinal = this.url_1 + data.clienteId +
                    this.url_2 +
                    this.url_3 + data.acceso +
                    this.url_4 + data.estado +
                    this.url_5 + authenticationService.currentUserValue.tokenInfo.accessToken;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
}

export interface AfiliacionesDialogData {
  clienteId: string;
  acceso: string;
  estado: string;
}
