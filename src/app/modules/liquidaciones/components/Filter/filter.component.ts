import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '@app/modules/shared/services/common.service';
import { Listable } from '@app/models/listable.model';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { LiquidacionesService } from '../../liquidaciones.service';
import { FilterData } from '../../models/filter-data';

@Component({
  selector: 'app-filter-liquidaciones',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() esEmpresa: boolean;
  @Output() getDataEvent = new EventEmitter<FilterData>();
  @Output() exportToExcelEvent = new EventEmitter<boolean>();
  @Output() applyFilterEvent = new EventEmitter<string>();

  userAcceso: number;

  descripcionInput: FormControl;
  periodoSelect: FormControl;
  diaSelect: FormControl;
  estadoSelect: FormControl;
  tipoSelect: FormControl;
  movilSelect: FormControl;
  filterData: FilterData;

  descripcionShow = true;
  estadoShow = true;
  diaShow = true;
  tipoShow = true;

  periodos: Listable[] = [new Listable('0', 'Todos')];
  dias: Listable[] = [new Listable('-1', 'Todos')];
  estados: Listable[] = [new Listable('0', 'Todos'),
  new Listable('1', 'Reclamados'),
  new Listable('2', 'Pendientes'),
  new Listable('3', 'Resueltos')
  ];
  tipos: Listable[] = [new Listable('0', 'Todas'),
  new Listable('1', 'Local'),
  new Listable('2', 'Interior')
  ];
  moviles: Listable[] = [new Listable('-1', '')];

  constructor(
    private liquidacionesService: LiquidacionesService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService) {
    this.filterData = new FilterData();
    this.userAcceso = parseInt(this.authenticationService.currentAcceso.toString());
  }

  ngOnInit(): void {
    this.descripcionInput = new FormControl();
    this.diaSelect = new FormControl(this.dias[0].id);
    this.estadoSelect = new FormControl(this.estados[0].id);
    this.tipoSelect = new FormControl(this.tipos[0].id);
    this.periodoSelect = new FormControl();
    this.movilSelect = new FormControl(this.moviles[0].id);

    this.tipoShow = this.esEmpresa && this.userAcceso == 3;

    this.liquidacionesService.getPeriodos(this.esEmpresa).subscribe(data => {
      this.periodos = data;
      this.periodoSelect = new FormControl(this.periodos[0].id);
      this.getDias();
      this.getMoviles();
    });
  }

  applyFilter(filterValue: string) {

    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }
    this.applyFilterEvent.emit(filterValue);
  }

  getDias() {
    let periodoSeleccionado = this.periodoSelect.value;
    let date = new Date();
    let maxDay = 0;
    if (date.getMonth() != parseInt(periodoSeleccionado.substr(4, 2)) - 1) {
      date.setDate(1);
      date.setMonth(parseInt(periodoSeleccionado.substr(4, 2)));
      date.setDate(date.getDate() - 1);
    }
    maxDay = date.getDate();
    for (let i = 1; i <= maxDay; i++) {
      this.dias.push(new Listable(i.toString(), (i < 10 ? '0' : '') + i.toString()));
    }
  }

  periodoChange(value: string): void {
    this.getDias();
    this.getMoviles(this.movilSelect.value.descripcion);
  }

  getMoviles(pPeriodoDesOriginal = '') {
    const that = this;
    that.isLoading = true;
    this.liquidacionesService.getMovilesEmpresas(this.periodoSelect.value, this.estadoSelect.value, this.tipoSelect.value, this.esEmpresa)
      .subscribe(data => {
        this.moviles = data;
        that.isLoading = false;
        if (pPeriodoDesOriginal != null) {
          let found = false;
          for (let i = 0; i < this.moviles.length; i++) {
            if (this.moviles[i].descripcion == pPeriodoDesOriginal) {
              found = true;
              this.movilSelect = new FormControl(this.moviles[i]);
              break;
            }
          }
          if (!found) {
            this.movilSelect = new FormControl(this.moviles[0]);
          }
        } else {
          this.movilSelect = new FormControl(this.moviles[0]);
        }
        // si obtengo los móviles puedo realizar la consulta.
        if (this.moviles.length > 0) {
          this.getData();
        } else {
          this.commonService.showSnackBarFatal('No se encontraron moviles/empresas');
        }
      });
  }

  getData() {
    if (this.periodoSelect.value <= 0) {
      this.commonService.showSnackBar('Debe ingresar el periodo.');
      return;
    }
    if (this.movilSelect.value?.id <= 0) {
      this.commonService.showSnackBar((this.esEmpresa) ? 'Debe ingresar la empresa' : 'Debe ingresar el móvil.');
      return;
    }
    this.filterData.buscar = this.descripcionInput.value;
    this.filterData.pMov = this.movilSelect.value?.id;
    this.filterData.pPer = this.periodoSelect.value;
    this.filterData.pDia = this.diaSelect.value;
    this.filterData.pEst = this.estadoSelect.value;
    this.getDataEvent.emit(this.filterData);
  }

  exportToExcel() {
    this.exportToExcelEvent.emit();
  }

  reliquidar() {
    this.liquidacionesService.reliquidar(this.movilSelect.value.id).subscribe(result => {
      if (result == 1) {
        this.commonService.showSnackBarSucces('Se realizo la Reliquidación exitosamente.');
        // this.getData();
      } else {
        this.commonService.showSnackBarFatal('Hubo un inconveniente, intente mas tarde.');
      }
    });
  }

  setVisibilityControls(index: number) {
    if (index == 0) {
      this.diaSelect.enable();
      this.estadoSelect.enable();
      this.estadoShow = true;
      this.diaShow = true;
      this.descripcionShow = true;
    } else {
      this.diaSelect.disable();
      this.estadoSelect.disable();
      this.estadoShow = false;
      this.diaShow = false;
      this.descripcionShow = false;
    }
  }
}
