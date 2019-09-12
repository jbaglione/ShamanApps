import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, ViewChild, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';

import { MoliService } from '../../moli.service';
import { MoliRealizado, MoliRealizadoForExcel } from '../../models/moli-realizado';
import { CommonService } from '@app/services/common.service';
import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';

@Component({
  selector: 'app-moli-realizados',
  templateUrl: './molirealizados.component.html',
  styleUrls: ['./molirealizados.component.css']
})

export class MoliRealizadosComponent implements OnInit {
  desde: FormControl;
  hasta: FormControl;
  descripcionInput: FormControl;
  isLoading: Boolean = false;

  dcMoliRealizados: string[] = [
    'fecIncidente',
    'nroIncidente',
    // 'clienteID',
    'llamada',
    'integranteId',
    'nombre',
    'domicilio',
    'localidad',
    'sintoma',
    'grado',
    'arribo',
    'diagnostico',
    'deriva',
    'final'
    // ,'nroInterno'
  ];
  mtMoliRealizados: MatTableDataSource<MoliRealizado> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort, {static: false}) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    private moliService: MoliService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private domSanitization: DomSanitizer
  ) {
    // this.commonService.setTitulo('Moli Realizados');
  }

  ngOnInit(): void {
    this.desde = new FormControl(this.prevMonth(new Date()));
    this.hasta = new FormControl(new Date());
    this.descripcionInput = new FormControl();
    this.getMoliRealizados();
  }
  setDataSourceAttributes() {
    this.mtMoliRealizados.paginator = this.paginator;
    this.mtMoliRealizados.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.mtMoliRealizados.filter = filterValue;
  }

  getMoliRealizados() {
    const that = this;

    that.isLoading = true;

    that.moliService
      .GetMoliRealizados$(this.desde.value, this.hasta.value)
      .subscribe(moliRealizados => {
        if (moliRealizados == null) {
          return;
        }
        that.isLoading = false;
        this.mtMoliRealizados = new MatTableDataSource(moliRealizados);
        this.applyFilter(this.descripcionInput.value);
        this.setDataSourceAttributes();
      });

  }

  prevMonth(date: Date): Date {
    const thisMonth = date.getMonth();
    date.setMonth(thisMonth - 1);
    if ((date.getMonth() !== thisMonth - 1) && (date.getMonth() !== 11 || (thisMonth === 11 && date.getDate() === 1))) {
      date.setDate(0);
    }
    return date;
  }


  exportToExcel() {
    ExportMatTableToXlxs.export(new MoliRealizadoForExcel(), this.mtMoliRealizados, 'molirealizados', this.commonService);
  }

}
