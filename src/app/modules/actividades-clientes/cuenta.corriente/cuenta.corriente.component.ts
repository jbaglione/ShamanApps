import { DomSanitizer } from '@angular/platform-browser';
import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';
import { FormControl } from '@angular/forms';

import { AuthenticationService } from '../../security/authentication.service';
import { ActividadesClientesService } from '../actividades-clientes.service';
import { ClienteCuentaCorriente } from 'src/app/models/cliente-cuentacorriente';

@Component({
  selector: 'app-actividades-clientes-cuentacorriente',
  templateUrl: './cuenta.corriente.component.html',
  styleUrls: ['./cuenta.corriente.component.css']
})

export class CuentaCorrienteComponent implements OnInit {
  @Input() clienteId: number;

  dcClienteCuentaCorriente: string[] = ['nro', 'fecDocumento', 'tipoComprobante', 'nroComprobante', 'debe', 'haber', 'comprobante'];
  mtClienteCuentaCorriente: MatTableDataSource<ClienteCuentaCorriente>;
  clienteCuentaCorriente: ClienteCuentaCorriente[];
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  descripcionInput: FormControl;

  constructor(
    private actividadesClientesService: ActividadesClientesService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer) {

    this.descripcionInput = new FormControl();
  }

  ngOnInit() {
    this.actividadesClientesService.GetCuentaCorriente(this.clienteId).subscribe(data => {
      this.clienteCuentaCorriente = data;
      this.mtClienteCuentaCorriente = new MatTableDataSource(data);
      this.mtClienteCuentaCorriente.paginator = this.paginator;
      this.mtClienteCuentaCorriente.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    if (filterValue != null && filterValue != '') {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.mtClienteCuentaCorriente.filter = filterValue;
    }
  }

  getTotalCost() {
    if (this.clienteCuentaCorriente != null) {
      const debeT: number = this.clienteCuentaCorriente.map(t => t.debe).reduce((acc, value) => acc + value, 0);
      const haberT: number  = this.clienteCuentaCorriente.map(t => t.haber).reduce((acc, value) => acc + value, 0);
      return haberT - debeT;
    } else { return 0; }
  }

  downloadComprobante(documentoId: number, tipoComprobante: string) {
    this.actividadesClientesService.GetComprobante(documentoId, tipoComprobante).subscribe(data => {
      if (data !== undefined) {
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      }
    });
  }

  // SKIP ADD BLOCK
  // downloadComprobante(nroComprobante: string) {
  //   let newWindow = window.open('/spinner', '_blank');
  //   if (newWindow.document.readyState === 'complete') {
  //     this.GoToRealUrl(nroComprobante, newWindow);
  //   } else {
  //     newWindow.onload = () => {
  //       this.GoToRealUrl(nroComprobante, newWindow);
  //     };
  //   }
  // }
  //  private GoToRealUrl(nroComprobante: string, newWindow: Window) {
  //   this.actividadesClientesService.GetComprobanteV2(nroComprobante).subscribe(data => {
  //     let file = new Blob([data], { type: 'application/pdf' });
  //     var fileURL = URL.createObjectURL(file);
  //     //return fileURL;
  //     newWindow.location.href = fileURL;
  //   });
  // }

  // GetCuentaCorrienteFiltrados() {
  //   this.actividadesClientesService.GetCuentaCorriente(this.clienteId, this.desde.value, this.hasta.value).subscribe(
  //     data => {
  //       this.mtClienteCuentaCorriente.data = data;
  //       this.applyFilter(this.descripcionInput.value);
  //     });
  // }
}
