import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from '@app/modules/shared/services/common.service';
import { PreIncidentesServicios } from './models/preIncidentesServicios';


@Component({
  selector: 'app-preincidentes-clientes',
  templateUrl: './preincidentes-clientes.component.html',
  styleUrls: ['./preincidentes-clientes.component.css']
})
export class PreIncidentesClientesComponent {
  selectTab = 0;
  preincidentes: PreIncidentesServicios;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
  ) {

  }
}
