import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/services/common.service';
import { AuditoriasMovilesService } from 'src/app/modules/auditorias-moviles/auditorias-moviles.service';
import { Auditoria } from './models/auditoria';

@Component({
  selector: 'app-auditorias-moviles',
  templateUrl: './auditorias-moviles.component.html',
  styleUrls: ['./auditorias-moviles.component.css']
})
export class AuditoriasMovilesComponent {
  movilId = 0;
  selectTab = 0;

  auditoria: Auditoria = new Auditoria();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private auditoriasMovilesService: AuditoriasMovilesService
  ) {

    activatedRoute.params.subscribe(params => {
      this.commonService.setTitulo('Auditorias del Movil');
      this.movilId = parseFloat(params.movilId);
      this.auditoriasMovilesService.GetAuditoria(this.movilId).subscribe(aud => this.auditoria = aud);
    });
  }
}
