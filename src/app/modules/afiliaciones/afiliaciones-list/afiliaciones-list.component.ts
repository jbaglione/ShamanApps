import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';

import { AfiliacionesService } from '../afiliaciones.service';
import { CommonService } from '@app/services/common.service';
import { AuthenticationService } from '@app/modules/security/authentication.service';

import { listable } from 'src/app/models/listable.model';
import { AfiliacionesDetailComponent } from '../afiliaciones-detail/afiliaciones-detail.component';
import { ClientePotencial, ClientePotencialForExcel } from 'src/app/models/cliente-potencial.model';
import { PotencialExitoComponent } from '../dialog-potencial-exito/dialog-potencial-exito.component';
import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';
import { MatTableLoadingService } from '@app/modules/shared/services/mat-table-loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-afiliaciones-list',
  templateUrl: './afiliaciones-list.component.html',
  styleUrls: ['./afiliaciones-list.component.css'],
  providers: [ MatTableLoadingService ]
})

export class AfiliacionesListComponent implements OnInit {
  //Seguridad
  userAcceso: string;

  // Filtros para busqueda
  descripcionInput: FormControl;
  tiposClientesSelect: FormControl;
  vendedoresSelect: FormControl;

  // Listados para combos
  tiposClientes: listable[] = [
    { descripcion: 'Todos', id: '0' },
    { descripcion: 'Potenciales', id: '1' },
    { descripcion: 'Preparados', id: '2' },
    { descripcion: 'Activos', id: '3' },
    { descripcion: 'Inactivos', id: '4' },
    { descripcion: 'Suspendidos', id: '5' }
  ];
  vendedores: listable[] = [{ descripcion: 'Todos', id: '0' }];

  vendedores$: Observable<listable[]>;
  clientesPotenciales$: Observable<ClientePotencial[]>;

  // Datos para grilla
  dcClientesPotencialesBasic: string[] = [
    'nombreComercial',
    'rubro',
    'razonSocial',
    'cuit',
    'domicilio',
    'localidad',
    'credencialID',
    'importeMensual',
    'estado',
    'actividad'
  ];
  dcClientesPotenciales: string[] = this.dcClientesPotencialesBasic;
  mtClientesPotenciales: MatTableDataSource<ClientePotencial> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;
  tooltipExito: listable[] = [
    { descripcion: 'Todos', id: '0' },
    { descripcion: 'Cambiar potencial de Exito', id: '1' },
    { descripcion: 'Cambiar estado Preparado', id: '2' },
    { descripcion: 'Activos', id: '3' },
    { descripcion: 'Inactivos', id: '4' },
    { descripcion: 'Suspendidos', id: 'Cambiar estado Suspendido' }
  ];
  estadosDesc: any[] = [
    { descripcion: 'Sin estado', icon: 'radio_button_unchecked', color: 'grey' },
    { descripcion: 'Potencial', icon: 'error', color: 'oldGold' }, // A400
    { descripcion: 'Preparado', icon: 'check_circle_outline', color: 'primary' },
    { descripcion: 'Activo', icon: 'check_circle_outline', color: 'success' },
    { descripcion: 'Inactivo', icon: 'cancel_outline', color: 'warn' },
    { descripcion: 'Suspendidos', icon: 'pause_circle_outline', color: 'accent' }
  ];

  @ViewChild(MatSort, {static: false}) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    private afiliacionesService: AfiliacionesService,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    public matTableLoadingService: MatTableLoadingService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.commonService.setTitulo('Clientes Potenciales');
  }

  ngOnInit() {
      this.userAcceso = this.authenticationService.getAccesosCurrentUser().toString();

    this.descripcionInput = new FormControl('');
    this.tiposClientesSelect = new FormControl(this.tiposClientes[0].id);
    this.vendedoresSelect = new FormControl(this.vendedores[0].id);
    this.getVendedores();
    this.getClientes(this.tiposClientes[0].id, '');
  }

  setDataSourceAttributes() {
    this.mtClientesPotenciales.paginator = this.paginator;
    this.mtClientesPotenciales.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.mtClientesPotenciales.filter = filterValue;
  }

  getVendedores() {
    this.vendedores$ =  this.afiliacionesService.getVendedores();
    this.vendedores$.subscribe(data => {
      this.vendedores = data;
    });
  }

  getClientes(tipoCliente: string, vendedor: string) {
    this.matTableLoadingService.activar();
    this.clientesPotenciales$ = this.afiliacionesService.getClientePotencial(tipoCliente, vendedor);
    this.clientesPotenciales$.subscribe(
      data => {
        if (data == null) {
          return;
        }
        if (this.tiposClientesSelect.value == 5) {
          this.dcClientesPotenciales = this.dcClientesPotencialesBasic.concat('potencialExito', 'motivoSuspension');
          this.dcClientesPotenciales.splice(this.dcClientesPotenciales.indexOf('domicilio'), 1);
        } else if (this.tiposClientesSelect.value == 1) {
          this.dcClientesPotenciales = this.dcClientesPotencialesBasic.concat(['potencialExito']);
        } else {
          this.dcClientesPotenciales = this.dcClientesPotencialesBasic;
        }
        this.mtClientesPotenciales.data = data;
        this.setDataSourceAttributes();
        this.matTableLoadingService.desactivar();
      },
      err => { this.matTableLoadingService.desactivar(); }
    );
  }

  openDialogCliente(paramClienteId: number = 0, paramClienteEstado: number = 1, ): void {
    const dialogRef = this.dialog.open(AfiliacionesDetailComponent, {
      width: '95vw',
      height: '95%',
      maxWidth: '95vw',
      panelClass: 'my-panel',
      data: { clienteId: paramClienteId, acceso: this.userAcceso, estado: paramClienteEstado }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  navigateToActividadCliente(paramClienteId: number = 0) {
    this.router.navigate(['actividadesclientes/', paramClienteId]);
  }

  cambiarPotencialExito(element: ClientePotencial = null): void {

    // alert('id' + id);
    const dialogRef = this.dialog.open(PotencialExitoComponent, {
      width: '95vw',
      maxWidth: '380px',
      data: { elemento: element } // id: id, clienteId: this.clienteId, acceso: this.userAcceso,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'updated') {
        this.getClientes(this.tiposClientesSelect.value, this.vendedoresSelect.value);
      }
    });
  }

  exportToExcel() {
    ExportMatTableToXlxs.export(new ClientePotencialForExcel(), this.mtClientesPotenciales, 'afiliaciones', this.commonService);
  }
}
