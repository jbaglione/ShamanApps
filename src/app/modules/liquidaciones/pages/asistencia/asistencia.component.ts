import { Component, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { LiquidacionesService } from '../../liquidaciones.service';
import { CommonService } from '@app/modules/shared/services/common.service';

import { AuthenticationService } from '@app/modules/security/authentication.service';
import { FilterData } from '../../models/filter-data';
import { Asistencia } from '../../models/asistencia';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})

export class AsistenciaComponent {

  userAcceso: number;
  isLoading = false;

  dcAsistencia: string[] = [

    'fecMovimiento',
    'diaSemana',
    'pacFecHorInicio',
    'pacFecHorFinal',
    'horasPactadas',
    'relFecHorInicio',
    // 'minTarde',
    'tarde',
    'relFecHorFinal',
    // 'minAnticipado',
    'anticipado',
    'motivoDescuento',
    // 'virEvlDescontable',
    'virTpoDescontable',
    'horasTrabajadas',
  ];


  // esEmpresa: boolean;
  filterData: FilterData;

  mtAsistencia: MatTableDataSource<Asistencia> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  @Input() esEmpresa: boolean;
  @Output() setIsLoadingEvent = new EventEmitter<boolean>();

  constructor(
    private liquidacionesService: LiquidacionesService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService) {

    this.userAcceso = parseInt(this.authenticationService.currentAcceso.toString());
  }

  setDataSourceAttributes() {
    this.mtAsistencia.paginator = this.paginator;
    this.mtAsistencia.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.mtAsistencia.filter = filterValue;
  }

  getData(filterData: FilterData = this.filterData) {

    this.filterData = filterData;
    const that = this;
    that.isLoading = true;
    this.mtAsistencia = new MatTableDataSource([]);

    that.liquidacionesService
      .getAsistencia(filterData.pMov, filterData.pPer)
      .subscribe(asistencias => {
        that.isLoading = false;
        that.setIsLoadingEvent.emit(false);
        if (asistencias == null) {
          return;
        }
        this.mtAsistencia = new MatTableDataSource(asistencias);
        this.applyFilter(filterData.buscar);
        this.setDataSourceAttributes();
      }, err => {
        that.isLoading = false;
        that.setIsLoadingEvent.emit(false);
      });
  }

  formatearHora(hora: string) {
    let myHora = new Date(hora);
    return myHora.getHours() > 0 || myHora.getMinutes() > 15 ? 'color: red;' : '';
  }

}
