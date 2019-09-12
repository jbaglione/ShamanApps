import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/services/common.service';
import { AfiliacionesService } from 'src/app/modules/afiliaciones/afiliaciones.service';
import { ClientePotencial } from 'src/app/models/cliente-potencial.model';
import { ConsumosComponent } from '../actividades-clientes/consumos/consumos.component';
@Component({
  selector: 'app-afiliaciones',
  templateUrl: './afiliaciones.component.html',
  styleUrls: ['./afiliaciones.component.css']
})

export class AfiliacionesComponent {
  // clienteId = 0;
  selectTab = 0;

  clientePotencial: ClientePotencial;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
    // private actividadesClientesService: AfiliacionesService
  ) {

    activatedRoute.params.subscribe(params => {
      this.commonService.setTitulo('Clientes Potenciales y Afiliaciones');
      // this.clienteId = parseFloat(params['clienteId']);
      // this.actividadesClientesService.GetClientePotencial(this.clienteId).subscribe(cli => this.clientePotencial = cli);
    });
  }
}