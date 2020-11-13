import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, ViewChild, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MoliService } from '../../moli.service';
import { MoliRechazado, MoliRechazadoForExcel } from '../../models/moli-rechazado';
import { CommonService } from '@app/modules/shared/services/common.service';
import { FileService } from '@app/modules/shared/services/files.service';

@Component({
  selector: 'app-moli-rechazados',
  templateUrl: './molirechazados.component.html',
  styleUrls: ['./molirechazados.component.css']
})

export class MoliRechazadosComponent implements OnInit {
  desde: FormControl;
  hasta: FormControl;
  descripcionInput: FormControl;
  isLoading: Boolean = false;

  dcMoliRechazados: string[] = [
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
    'motivoRechazo'
  ];
  mtMoliRechazados: MatTableDataSource<MoliRechazado> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    if (this.paginator) {
      this.paginator.pageSizeOptions = [7, 10, 25, 100];
    }
    this.setDataSourceAttributes();
  }

  constructor(
    private moliService: MoliService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private domSanitization: DomSanitizer,
    private fileService: FileService
  ) {
    // this.commonService.setTitulo('Moli Rechazados');
  }

  ngOnInit(): void {
    this.desde = new FormControl(this.prevMonth(new Date()));
    this.hasta = new FormControl(new Date());
    this.descripcionInput = new FormControl();
    this.getMoliRechazados();
  }
  setDataSourceAttributes() {
    this.mtMoliRechazados.paginator = this.paginator;
    this.mtMoliRechazados.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }
    this.mtMoliRechazados.filter = filterValue;
  }

  getMoliRechazados() {
    const that = this;

    that.isLoading = true;

    that.moliService
      .GetMoliRechazados$(this.desde.value, this.hasta.value)
      .subscribe(moliRechazados => {
        if (moliRechazados == null) {
          return;
        }
        that.isLoading = false;
        this.mtMoliRechazados = new MatTableDataSource(moliRechazados);
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
    this.fileService.exportMatTable(new MoliRechazadoForExcel(), this.mtMoliRechazados, 'molirechazados');
  }

}
