import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { BitacorasService } from '../bitacoras.service';
import { CommonService } from '../../shared/services/common.service';
import { Bitacora } from 'src/app/models/bitacora.model';
import { ProgressBarService } from '@app/modules/shared/services/progress-bar.service';
import { SiteInfo } from '@app/models/site-info.model';


@Component({
  selector: 'app-bitacoras-list',
  templateUrl: './bitacoras-list.component.html',
  styleUrls: ['./bitacoras-list.component.css']
})
export class ListBitacorasComponent implements OnInit {

  dcBitacoras: string[] = ['nro', 'fecha', 'hora', 'titulo', 'motivo', 'administrador', 'estado', 'ultFecha', 'diasRta', 'duracion'];
  mtBitacoras: MatTableDataSource<Bitacora>;
  userToken: string;
  rowid = -1;
  site: SiteInfo = new SiteInfo('bitacoras', 'Bitácoras', 'Bitácora', 'F');

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private bitacorasService: BitacorasService,
    private commonService: CommonService,
    private router: Router,
    private progressBarService: ProgressBarService ) {

    if (router.url.includes('hallazgos')) {
      this.site.url = 'hallazgos';
      this.site.nombre = 'Hallazgos';
      this.site.nombreSingular = 'Hallazgo';
      this.site.nombreGenero = 'M';
    }

    commonService.setTitulo(`Lista de ${this.site.nombre}`);
  }

  ngOnInit() {

    this.progressBarService.activarProgressBar();
    this.bitacorasService.GetBitacoras().subscribe(data => {
      this.progressBarService.desactivarProgressBar();
      this.mtBitacoras = new MatTableDataSource(data);
      this.mtBitacoras.paginator = this.paginator;
      this.mtBitacoras.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {

    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }

    if (this.mtBitacoras != null) {
      this.mtBitacoras.filter = filterValue;
    }
  }

  verBitacora(id: any) {
    if (id == 'new') {
      id = this.site.nombreGenero == 'M' ? 'nuevo' : 'nueva';
    }

    this.router.navigate([`${this.site.url}/detail`, id]);
  }

  onMouseOver(element) {
    this.rowid = element.id; // this.mtBitacoras.data.findIndex(x => x.id == element.id);
    console.log(this.rowid);
  }
}
