import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { FacturacionService } from '../../facturacion.service';
import { Comprobante } from '../../models/comprobante';
import { CommonService } from '@app/modules/shared/services/common.service';
import { Router } from '@angular/router';
import { FileService } from '@app/modules/shared/services/files.service';


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

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    private facturacionService: FacturacionService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private router: Router,
    private fileService: FileService
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
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }
    this.mtComprobantes.filter = filterValue;
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
        // this.fileShareService.shareBuffer(data, 'factura', FileSharerService.PDF_SHARE_TYPE);

        this.fileService.saveBuffer(data, 'factura', FileService.PDF_TYPE);
        // const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
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
