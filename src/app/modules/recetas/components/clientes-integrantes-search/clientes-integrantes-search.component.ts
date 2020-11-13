import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientesIntegrantes } from '../../models/clientes-integrantes.model';

import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ClientesIntegrantesService } from '../../services/clientes-integrantes.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableLoadingService } from '@app/modules/shared/services/mat-table-loading.service';

@Component({
  selector: 'app-clientes-integrantes-search',
  templateUrl: './clientes-integrantes-search.component.html',
  styleUrls: ['./clientes-integrantes-search.component.css'],
  providers: [ MatTableLoadingService ]
})

export class ClientesIntegrantesSearchComponent {
  clienteIntegrante = <ClientesIntegrantes>{};
  clienteId: number;

  clientesIntegrantesFormGroup: FormGroup;

  dcClientesIntegrantes: string[] = ['nroAfiliado', 'apellido', 'nombre', 'dni'];
  mtClientesIntegrantes: MatTableDataSource<ClientesIntegrantes> = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  isLoading = false;
  rowNroAfiliado: string;
  highlightedRows = [];
  eliminarClick: boolean;

  constructor(public dialogRef: MatDialogRef<ClientesIntegrantesSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientesIntegrantesSearchDialogData,
    private clientesIntegrantesService: ClientesIntegrantesService,
    public matTableLoadingService: MatTableLoadingService) {

    if (!data.clienteId) {
      this.dialogRef.close();
    } else {
      this.clienteIntegrante.nroAfiliado = data.nroAfiliado;
      this.clienteIntegrante.paciente = data.paciente;
      this.clienteId = data.clienteId;

      this.clientesIntegrantesFormGroup = new FormGroup({
        nroAfiliado: new FormControl(),
        apellido: new FormControl(),
        nombre: new FormControl(),
        dni: new FormControl()
      });
    }

  }

  setDataSourceAttributes() {
    this.mtClientesIntegrantes.paginator = this.paginator;
    this.mtClientesIntegrantes.sort = this.sort;
  }

  setupFilter(column: string) {
    if (this.mtClientesIntegrantes) {
      this.mtClientesIntegrantes.filterPredicate = (d: ClientesIntegrantes, filter: string) => {
        const textToSearch = d[column] && d[column].toLowerCase() || '';
        return textToSearch.indexOf(filter) !== -1;
      };
    }
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }

    if (this.mtClientesIntegrantes != null) {
      this.mtClientesIntegrantes.filter = filterValue;
    }
  }

  getData() {
    this.matTableLoadingService.activar();
    this.clientesIntegrantesService.GetByClienteId(
      this.clienteId,
      this.clientesIntegrantesFormGroup.controls.nroAfiliado.value,
      this.clientesIntegrantesFormGroup.controls.apellido.value,
      this.clientesIntegrantesFormGroup.controls.nombre.value,
      this.clientesIntegrantesFormGroup.controls.dni.value
    ).subscribe(data => {
      this.matTableLoadingService.desactivar();
      this.mtClientesIntegrantes = new MatTableDataSource(data);
      this.mtClientesIntegrantes.paginator = this.paginator;
      this.mtClientesIntegrantes.sort = this.sort;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selClienteIntegrante(clienteIntegrante: ClientesIntegrantes) {
    if (this.eliminarClick) {
      this.eliminarClick = false;
      return;
    }
    this.highlightedRows = [];
    this.highlightedRows.push(clienteIntegrante);
    const that = this;
  }

  onMouseOver(clienteIntegrante: ClientesIntegrantes) {
    this.rowNroAfiliado = clienteIntegrante.nroAfiliado;
  }

  retornarClienteIntegrante() {
    let clienteIntegreante: ClientesIntegrantes;
    if (this.highlightedRows.length > 0) {
      clienteIntegreante = this.highlightedRows[0];
      clienteIntegreante.paciente = clienteIntegreante.apellido + ' ' + clienteIntegreante.nombre;
    }
    this.dialogRef.close(clienteIntegreante);
  }

}

export interface ClientesIntegrantesSearchDialogData {
  nroAfiliado: string;
  paciente: string;
  clienteId: number;
}
