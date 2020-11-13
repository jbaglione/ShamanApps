import { Component, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { LiquidacionesService } from '../../liquidaciones.service';
import { IncidentesForExcel } from '../../models/incidentes';
import { CommonService } from '@app/modules/shared/services/common.service';
import { FileService } from '@app/modules/shared/services/files.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { FilterData } from '../../models/filter-data';
import { Resumen } from '../../models/resmune.model';
import { ResumenItem } from '../../models/resumen-item.model';
import { ResumenDetalleComponent } from '../../components/resumen-detalle/resumen-detalle.component';
import { ResumenHorasComponent } from '../../components/resumen-horas/resumen-horas.component';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})

export class ResumenComponent {
  @Input() esEmpresa: boolean;
  @Output() setIsLoadingEvent = new EventEmitter<boolean>();

  userAcceso: number;
  isLoading = false;

  filterData: FilterData;

  resumen: Resumen;


  mtProductividad: MatTableDataSource<ResumenItem> = new MatTableDataSource();
  dcProductividad: string[] = [
    'descripcion',
    'importe',
  ];
  mtFactura: MatTableDataSource<ResumenItem> = new MatTableDataSource();
  dcFactura: string[] = [
    'descripcion',
    'importe',
  ];
  mtRetenciones: MatTableDataSource<ResumenItem> = new MatTableDataSource();
  dcRetenciones: string[] = [
    'descripcion',
    'importe',
  ];
  mtDescuentos: MatTableDataSource<ResumenItem> = new MatTableDataSource();
  dcDescuentos: string[] = [
    'descripcion',
    'importe',
  ];
  mtPagos: MatTableDataSource<ResumenItem> = new MatTableDataSource();
  dcPagos: string[] = [
    'descripcion',
    'importe',
  ];

  constructor(
    private liquidacionesService: LiquidacionesService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private cd: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private router: Router) {

    this.userAcceso = parseInt(this.authenticationService.currentAcceso.toString());
  }

  getData(filterData: FilterData = this.filterData) {
    this.filterData = filterData;
    const that = this;
    that.isLoading = true;
    this.mtProductividad = new MatTableDataSource([]);
    this.mtFactura = new MatTableDataSource([]);
    this.mtRetenciones = new MatTableDataSource([]);
    this.mtDescuentos = new MatTableDataSource([]);
    this.mtPagos = new MatTableDataSource([]);
    that.liquidacionesService
      .getResumen(filterData.pMov) // , filterData.pPer
      .subscribe(resumen => {
        that.isLoading = false;
        this.setIsLoadingEvent.emit(false);

        if (resumen == null) {
          return;
        }
        this.resumen = resumen;
        this.mtProductividad = new MatTableDataSource(resumen.productividad);
        this.mtFactura = new MatTableDataSource(resumen.factura);
        this.mtRetenciones = new MatTableDataSource(resumen.retenciones);
        this.mtDescuentos = new MatTableDataSource(resumen.descuentos);
        this.mtPagos = new MatTableDataSource(resumen.pagos);
      }, err => {
        that.isLoading = false;
        that.setIsLoadingEvent.emit(false);
      });
  }

   // POPUP DETALLE
   resumenDetalle(element: ResumenItem) {
    const dialogRef = this.dialog.open(ResumenDetalleComponent, {
      width: '95vw',
      maxWidth: '500px',
      data: { pResumenItem: element, pItmLiq: this.filterData.pPer}
    });
  }

  // POPUP DETALLE HORAS
  resumenHoras(element: ResumenItem) {
    const dialogRef = this.dialog.open(ResumenHorasComponent, {
      width: '95vw',
      maxWidth: '500px',
      data: { pResumenItem: element}
    });
  }

  goToCuentasCorrientes() {
    this.router.navigate(['extranet-v1/index/27']);
  }

  // POPUP RESUMEN DETALLE
  // productividadMovilDetalle

  exportToExcel() {
    this.fileService.exportMatTable(new IncidentesForExcel(), this.mtFactura, 'prestaciones');
  }

}
