import { FormControl } from '@angular/forms';
import { Component, ViewChild, ViewChildren, QueryList, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { PacientesCovidService } from '../../pacientes-covid.service';
import { CommonService } from '@app/modules/shared/services/common.service';
import { Observable } from 'rxjs';
import { PacienteCovid, PacienteCovidForExcel } from '../../models/pacientes-covid.model';
import { FileService } from '@app/modules/shared/services/files.service';

@Component({
  selector: 'app-pacientes-covid',
  templateUrl: './pacientes-covid.component.html',
  styleUrls: ['./pacientes-covid.component.css']
})

export class PacientesCovidComponent implements OnInit {
  // Filtros para busqueda
  desde: FormControl;
  hasta: FormControl;
  descripcionInput: FormControl;
  pacientesCovid$: Observable<PacienteCovid[]>;

  // Datos para grilla
  isLoading: Boolean = false;
  dcPacientesCovid: string[] = [
    'fecIncidente',
    'nroIncidente',
    'clienteId',
    'nroAfiliado',
    'paciente',
     // 'fecNacimiento',
    'edad',
    // 'nroDocumento',
    'domicilio',
    'localidad',
    'telefono',
    // 'entreCalle1',
    // 'entreCalle2',
    'sintoma',
    'estado',
    'doctor',
    'observaciones',
  ];
  mtPacientesCovid: MatTableDataSource<PacienteCovid> = new MatTableDataSource();
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

  constructor(
    private operativaClientesService: PacientesCovidService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private fileService: FileService
  ) {
    this.commonService.setTitulo('Gestión de PacientesCovid');
  }

  ngOnInit(): void {
    this.desde = new FormControl(this.prevMonth(new Date()));
    this.hasta = new FormControl(new Date());
    this.descripcionInput = new FormControl();
    this.getPacientesCovid();
  }

  setDataSourceAttributes() {
    this.mtPacientesCovid.paginator = this.paginator;
    this.mtPacientesCovid.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }
    this.mtPacientesCovid.filter = filterValue;
  }

  getPacientesCovid() {
    const that = this;
    that.isLoading = true;

    that.pacientesCovid$ = that.operativaClientesService.GetPacientesCovid(this.desde.value, this.hasta.value);

    that.pacientesCovid$.subscribe(
      pacientesCovid => {
        if (pacientesCovid == null) {
          return;
        }
        that.isLoading = false;
        this.mtPacientesCovid = new MatTableDataSource(pacientesCovid);
        this.setDataSourceAttributes();
      },
      err => { this.isLoading = false; }
    );
  }

  exportToExcel() {
    this.fileService.exportMatTable(new PacienteCovidForExcel(), this.mtPacientesCovid, 'sospechas_COVID19');
  }


  prevMonth(date: Date): Date {
    const thisMonth = date.getMonth();
    date.setMonth(thisMonth - 1);
    if ((date.getMonth() !== thisMonth - 1) && (date.getMonth() !== 11 || (thisMonth === 11 && date.getDate() === 1))) {
      date.setDate(0);
    }
    return date;
  }
}
