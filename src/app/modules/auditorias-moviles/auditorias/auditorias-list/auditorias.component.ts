import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';

import { AuditoriasMovilesService } from '../../auditorias-moviles.service';
import { AuthenticationService } from '../../../security/authentication.service';
import { Auditoria } from '../../models/auditoria';
import { AuditoriaDetailComponent } from '../auditoria-detail/auditoria-detail.component';
import { listable } from 'src/app/models/listable.model';
import { FormControl } from '@angular/forms';
import { MatTableLoadingService } from '@app/modules/shared/services/mat-table-loading.service';

@Component({
  selector: 'app-auditorias-moviles-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.css'],
  providers: [ MatTableLoadingService ]
})

export class AuditoriasComponent implements OnInit {
  @Input() movilId = 0;

  // Seguridad
  userAcceso: string;
  userId: number;
  modoGenerico: boolean;

  // Filtros para busqueda
  descripcionInput: FormControl;
  desde: FormControl;
  hasta: FormControl;
  vendedorSelect: FormControl;

  vendedores: listable[] = [{ descripcion: 'Todos', id: '0' }];

  // Datos para grilla
  dcAuditoriasMoviles: string[] = [
    'fecha',
    'dominioId',
    'chofer',
    'medico',
    'enfermero',
    'condicion',
    'edit',
    'delete'
  ];
  mtAuditoriasMoviles: MatTableDataSource<Auditoria> = new MatTableDataSource();
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
    private auditoriasMovilesService: AuditoriasMovilesService,
    private authenticationService: AuthenticationService,
    public matTableLoadingService: MatTableLoadingService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.userAcceso = this.authenticationService.getAccesosCurrentUser().toString();
    this.userId = this.authenticationService.currentUserValue.id;
    this.modoGenerico = this.movilId === 0;

    this.descripcionInput = new FormControl('');
    this.desde = new FormControl(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    this.hasta = new FormControl(new Date());
    this.vendedorSelect =  new FormControl(this.vendedores[0].id);

    if (this.modoGenerico) {
      if (this.userAcceso === '3') {
        this.auditoriasMovilesService
          .getVendedores()
          .subscribe(data => {
            this.vendedores = data;
          });
      }

      // this.dcAuditoriasMoviles.splice( 1, 0, 'razonSocial');
    }
    this.LoadData();
  }

  setDataSourceAttributes() {
    this.mtAuditoriasMoviles.paginator = this.paginator;
    this.mtAuditoriasMoviles.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.mtAuditoriasMoviles.filter = filterValue;
  }


  private GetAuditorias() {
    this.matTableLoadingService.activar();
    this.auditoriasMovilesService
      .GetAuditorias(this.movilId)
      .subscribe(data => {
        this.mtAuditoriasMoviles = new MatTableDataSource(data);
        this.setDataSourceAttributes();
        this.matTableLoadingService.desactivar();
      },
      err => { this.matTableLoadingService.desactivar(); } );
  }

  GetAuditoriasGenerales() {
    let vendedor: string;
    let modoAdmin = false;

    this.matTableLoadingService.activar();

    if (this.vendedorSelect.value === 0) {
      modoAdmin = this.userAcceso === '3';
      vendedor = this.userId.toString();
    } else {
      vendedor = this.vendedorSelect.value;
    }

    this.auditoriasMovilesService
      .GetAuditoriasGenerales(this.desde.value, this.hasta.value, vendedor, 0, modoAdmin)
      .subscribe( data => {
        this.mtAuditoriasMoviles = new MatTableDataSource(data);
        this.setDataSourceAttributes();
        this.matTableLoadingService.desactivar();
      },
      err => {  this.matTableLoadingService.desactivar(); } );
  }

  private LoadData() {
    if (this.modoGenerico) {
      this.GetAuditoriasGenerales();
    } else {
      this.GetAuditorias();
    }
    this.applyFilter(this.descripcionInput.value);
  }

  eliminarAuditoria(id: any) {
    console.log(`eliminar auditoria id= ${id}`);
    this.auditoriasMovilesService.EliminarAuditoria(id).subscribe(result => { if (result == null) { this.LoadData(); } });
  }

  verAuditoria(id: any = 0, element: Auditoria = null): void {

    const dialogRef = this.dialog.open(AuditoriaDetailComponent, {
      width: '95vw',
      maxWidth: '700px',
      data: { id: id, clienteId: this.movilId, acceso: this.userAcceso, elemento: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.LoadData();
      }
    });
  }
}
