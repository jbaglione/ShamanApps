import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';

import { AuthenticationService } from '../../../security/authentication.service';
import { ClientesGestion } from 'src/app/models/clientes-gestion';
import { ActividadesClientesService } from '../../actividades-clientes.service';
import { GestionDetailComponent } from '../gestion-detail/gestion-detail.component';
import { listable } from 'src/app/models/listable.model';
import { FormControl } from '@angular/forms';
import { MatTableLoadingService } from '@app/modules/shared/services/mat-table-loading.service';

@Component({
  selector: 'app-actividades-clientes-gestiones',
  templateUrl: './gestiones.component.html',
  styleUrls: ['./gestiones.component.css'],
  providers: [ MatTableLoadingService ]
})

export class GestionesComponent implements OnInit {
  @Input() clienteId = 0;

  // Seguridad
  userAcceso: string;
  userId: number;
  modoGenerico: boolean;

  // Filtros para busqueda
  descripcionInput: FormControl;
  tipoFechaGestionSelect: FormControl;
  desde: FormControl;
  hasta: FormControl;
  vendedorSelect: FormControl;

  // Listados para combos
  tiposFechas: listable [] = [
    { descripcion: 'Realizadas', id: '0' },
    { descripcion: 'Programadas', id: '1' }
  ];
  vendedores: listable[] = [{ descripcion: 'Todos', id: '0' }];

  // Datos para grilla
  dcClientesGestiones: string[] = [
    'fecha',
    'tipoGestion',
    'observaciones',
    'fechaRecontacto',
    'adjunto',
    'edit',
    'delete'
  ];
  mtClientesGestiones: MatTableDataSource<ClientesGestion> = new MatTableDataSource();
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
    private gestionesService: ActividadesClientesService,
    private authenticationService: AuthenticationService,
    public matTableLoadingService: MatTableLoadingService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.userAcceso = this.authenticationService.getAccesosCurrentUser().toString();
    this.userId = this.authenticationService.currentUserValue.id;
    this.modoGenerico = this.clienteId == 0;


    this.descripcionInput = new FormControl('');
    this.tipoFechaGestionSelect = new FormControl(this.tiposFechas[0].id);
    this.desde = new FormControl(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    this.hasta = new FormControl(new Date());
    this.vendedorSelect =  new FormControl(this.vendedores[0].id);

    if (this.modoGenerico) {
      if (this.userAcceso == '3') {
        this.gestionesService
          .getVendedores()
          .subscribe(data => {
            this.vendedores = data;
          });
      }

      this.dcClientesGestiones.splice( 1, 0, 'razonSocial');
    }
    this.LoadData();
  }

  setDataSourceAttributes() {
    this.mtClientesGestiones.paginator = this.paginator;
    this.mtClientesGestiones.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.mtClientesGestiones.filter = filterValue;
  }


  private GetGestiones() {
    this.matTableLoadingService.activar();
    this.gestionesService
      .GetGestiones(this.clienteId)
      .subscribe(data => {
        this.mtClientesGestiones = new MatTableDataSource(data);
        this.setDataSourceAttributes();
        this.matTableLoadingService.desactivar();
      },
      err => { this.matTableLoadingService.desactivar(); } );
  }

  GetGestionesGenerales() {
    let vendedor: string;
    let modoAdmin = false;

    this.matTableLoadingService.activar();

    if (this.vendedorSelect.value == 0) {
      modoAdmin = this.userAcceso == '3';
      vendedor = this.userId.toString();
    } else {
      vendedor = this.vendedorSelect.value;
    }

    this.gestionesService
      .GetGestionesGenerales( this.tipoFechaGestionSelect.value, this.desde.value, this.hasta.value, vendedor, 0, modoAdmin)
      .subscribe( data => {
        this.mtClientesGestiones = new MatTableDataSource(data);
        this.setDataSourceAttributes();
        this.matTableLoadingService.desactivar();
      },
      err => {  this.matTableLoadingService.desactivar(); } );
  }

  private LoadData() {
    if (this.modoGenerico) {
      this.GetGestionesGenerales();
    } else {
      this.GetGestiones();
    }
    this.applyFilter(this.descripcionInput.value);
  }

  eliminarGestion(id: any) {
    console.log(`eliminar gestion id= ${id}`);
    this.gestionesService.EliminarGestion(id).subscribe(result => { if (result == null) { this.LoadData(); } });
  }

  verGestion(id: any = 0, element: ClientesGestion = null): void {

    const dialogRef = this.dialog.open(GestionDetailComponent, {
      width: '95vw',
      maxWidth: '700px',
      data: { id: id, clienteId: this.clienteId, acceso: this.userAcceso, elemento: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'updated') {
        this.LoadData();
      }
    });
  }
}
