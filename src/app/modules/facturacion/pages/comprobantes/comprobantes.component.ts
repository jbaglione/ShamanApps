import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';

import { FacturacionService } from '../../facturacion.service';
import { Comprobante } from '../../models/comprobante';
import { CommonService } from '@app/services/common.service';
import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comprobantes',
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.css']
})

export class ComprobantesComponent  implements OnInit {
  descripcionInput: FormControl;
  isLoading: Boolean = false;

  dcComprobantes: string[] = [
    'formatedFecha',
    'tipoComprobante',
    'nroComprobante',
    'importeExento',
    'importeGravado',
    'porcentajeIva',
    'importeIva',
    'porcentajeARBA',
    'importeARBA',
    'porcentajeAGIP',
    'importeAGIP',
    'importe',
    'descargar',
    'abrir'
  ];
  mtComprobantes: MatTableDataSource<Comprobante> = new MatTableDataSource();
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
    private facturacionService: FacturacionService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.commonService.setTitulo('Comprobantes');
  }

  ngOnInit() {
    this.descripcionInput = new FormControl();
    this.getComprobantes();
  }

  setDataSourceAttributes() {
    this.mtComprobantes.paginator = this.paginator;
    this.mtComprobantes.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    if (filterValue != null && filterValue != '') {
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.mtComprobantes.filter = filterValue;
    }
  }

  getComprobantes() {
    const that = this;
    that.isLoading = true;
    that.facturacionService
      .getComprobantes()
      .subscribe(comprobantes => {
        if (comprobantes == null) {
          return;
        }
        that.isLoading = false;
        this.mtComprobantes = new MatTableDataSource(comprobantes);
        this.setDataSourceAttributes();
        this.applyFilter(this.descripcionInput.value);
      });
  }

  getComprobantePdf(documentoId: number) {
    this.facturacionService.getComprobantePdf(documentoId).subscribe(data => {
      if (data !== undefined) {
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      }
    });
  }

  abrirFactura(comprobaneId: number) {
    this.router.navigate(['facturacion/servicios/', comprobaneId]);
  }


  // exportToExcel() {
  //   ExportMatTableToXlxs.export(new ComprobanteForExcel(), this.mtComprobantes, 'comprobantes', this.commonService);
  // }

}
