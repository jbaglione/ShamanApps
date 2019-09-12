import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/services/common.service';
import { ActividadesClientesService } from 'src/app/modules/actividades-clientes/actividades-clientes.service';
import { ClientePotencial } from 'src/app/models/cliente-potencial.model';

@Component({
  selector: 'app-actividades-clientes',
  templateUrl: './actividades-clientes.component.html',
  styleUrls: ['./actividades-clientes.component.css']
})
export class ActividadesClientesComponent {
  clienteId = 0;
  selectTab = 0;

  clientePotencial: ClientePotencial = new ClientePotencial();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private actividadesClientesService: ActividadesClientesService
  ) {

    activatedRoute.params.subscribe(params => {
      this.commonService.setTitulo('Actividades del Cliente');
      this.clienteId = parseFloat(params['clienteId']);
      this.actividadesClientesService.GetClientePotencial(this.clienteId).subscribe(cli => this.clientePotencial = cli);
    });
  }
}