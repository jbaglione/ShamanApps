import { Component, OnInit } from '@angular/core';
import { Alerta } from '../../models/alerta.model';
import { AlertasService } from '@app/modules/mensajeria/services/alertas.service';
import { SecureLayoutService } from '@app/modules/core/services/secure-layout.service';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {
  alertas: Alerta [];

  constructor(
    private alertasService: AlertasService,
    private secureLayoutService: SecureLayoutService
  ) { }

  ngOnInit() {
    this.alertasService
    .GetAlertas()
    .subscribe(data => {
      this.alertas = data;
    });
  }

  close() {
    this.secureLayoutService.CloseSidenavAlertas();
  }

}
