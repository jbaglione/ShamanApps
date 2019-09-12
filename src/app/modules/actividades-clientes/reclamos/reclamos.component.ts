import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';
import { FormControl } from '@angular/forms';

import { AuthenticationService } from '../../security/authentication.service';
import { ActividadesClientesService } from '../actividades-clientes.service';
import { ClienteReclamo } from 'src/app/models/cliente-reclamo';
import { listable } from 'src/app/models/listable.model';
import { MatTableLoadingService } from '@app/modules/shared/services/mat-table-loading.service';

@Component({
  selector: 'app-actividades-clientes-reclamos',
  templateUrl: './reclamos.component.html',
  styleUrls: ['./reclamos.component.css'],
  providers: [ MatTableLoadingService ]
})

export class ReclamosComponent implements OnInit {
  @Input() clienteId = 0;

  // Seguridad
  userAcceso: string;
  userId: number;
  modoGenerico: boolean;

  // Filtros para busqueda
  desde: FormControl;
  hasta: FormControl;
  descripcionInput: FormControl;
  vendedorSelect: FormControl;

  // Listados para combos
  vendedores: listable[] = [{ descripcion: 'Todos', id: '0' }];

  // Datos para grilla
  dcClienteReclamos: string[] = [
    'nro',
    'fecInicio',
    'tipoReclamo',
    'motivo',
    'cliente',
    'situacion',
    'administrador',
    'prioridad',
    'fecIncidente',
    'nroIncidente'
  ];
  mtClienteReclamos: MatTableDataSource<ClienteReclamo> = new MatTableDataSource();
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
    private actividadesClientesService: ActividadesClientesService,
    private authenticationService: AuthenticationService,
    public matTableLoadingService: MatTableLoadingService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.userAcceso = this.authenticationService.getAccesosCurrentUser().toString();
    this.userId = this.authenticationService.currentUserValue.id;
    this.modoGenerico = this.clienteId == 0;

    this.descripcionInput = new FormControl('');
    this.desde = new FormControl(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    this.hasta = new FormControl(new Date());
    this.vendedorSelect =  new FormControl(this.vendedores[0].id);

    if (this.modoGenerico) {
      if (this.userAcceso == '3') {
        this.actividadesClientesService
          .getVendedores()
          .subscribe(data =>
            this.vendedores = data
          );
      }
      this.desde = new FormControl(new Date(new Date().setMonth(new Date().getMonth() - 1)));
      this.dcClienteReclamos.splice( 1, 0, 'razonSocial');
    }
    this.GetReclamos();
  }

  setDataSourceAttributes() {
    this.mtClienteReclamos.paginator = this.paginator;
    this.mtClienteReclamos.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.mtClienteReclamos.filter = filterValue;
  }

  private GetReclamos() {
    let vendedor: string;
    let modoAdmin = false;

    this.matTableLoadingService.activar();

    if (this.vendedorSelect.value == 0 || !this.modoGenerico) {
      modoAdmin = this.userAcceso == '3';
      vendedor = this.userId.toString();
    } else {
      vendedor = this.vendedorSelect.value;
    }

    this.actividadesClientesService
    .GetReclamos(this.desde.value, this.hasta.value, vendedor, this.clienteId, modoAdmin)
    .subscribe(data => {
      this.mtClienteReclamos = new MatTableDataSource(data);
      this.setDataSourceAttributes();
      this.matTableLoadingService.desactivar();
    },
    err => {  this.matTableLoadingService.desactivar(); } );
  }

  GetReclamosFiltrados() {
    this.GetReclamos();
    this.applyFilter(this.descripcionInput.value);
  }
}
