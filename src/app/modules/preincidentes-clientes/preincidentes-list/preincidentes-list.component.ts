import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AuthenticationService } from '../../security/authentication.service';

import { FormControl } from '@angular/forms';
import { MatTableLoadingService } from '@app/modules/shared/services/mat-table-loading.service';
import { DialogComponent } from '@app/modules/shared/dialog/dialog.component';
import { PreIncidentesClientesService } from '../preincidentes-clientes.service';
import { PreIncidentesDetailComponent } from '../preincidentes-detail/preincidentes-detail.component';
import { ClienteInfo } from '../../../models/clienteInfo';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { PreIncidentesServicios } from '../models/preIncidentesServicios';

@Component({
  selector: 'app-preincidentes-clientes',
  templateUrl: './preincidentes-list.component.html',
  styleUrls: ['./preincidentes-list.component.css'],
  providers: [MatTableLoadingService]
})

export class PreIncidentesListComponent implements OnInit {
  @Input() movilId = 0;

  // Seguridad
  userAcceso: string;
  userId: number;
  modoGenerico: boolean;
  clienteInfo: ClienteInfo;

  // Filtros para busqueda
  descripcionInput: FormControl;
  desde: FormControl;
  hasta: FormControl;

  // Datos para grilla
  dcPreIncidentesServicios: string[] = [
    // 'id',
    'nroServicio',
    'fecha',
    'grado',
    'nroAfiliado',
    'paciente',
    'virDomicilio',
    'sintoma',
    'estado',
    'observaciones'
    // 'edit',
    // 'delete'
  ];

  estadosDesc: any[] = [
    { descripcion: 'Sin estado', icon: 'radio_button_unchecked', color: 'grey' },
    { descripcion: 'Pendiente de aprobación', icon: 'error', color: 'oldGold' }, // A400
    { descripcion: 'Aprobado', icon: 'check_circle_outline', color: 'success' },
    { descripcion: 'Rechazado', icon: 'cancel_outline', color: 'warn' },
  ];

  mtPreIncidentesServicios: MatTableDataSource<PreIncidentesServicios> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;
  rowid: -1;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    private preincidentesClientesService: PreIncidentesClientesService,
    private authenticationService: AuthenticationService,
    public matTableLoadingService: MatTableLoadingService,
    public dialog: MatDialog) {
    this.userAcceso = this.authenticationService.currentAcceso.toString();
    this.userId = this.authenticationService.currentUser.id;
    this.modoGenerico = this.movilId === 0;
    this.descripcionInput = new FormControl('');
    this.desde = new FormControl(new Date(new Date().setDate(new Date().getDate() - 7)));
    this.hasta = new FormControl(new Date());
  }

  ngOnInit() {

    this.getPreIncidentesGenerales();

    this.preincidentesClientesService.GetClienteInfo().subscribe(cli => {
      this.clienteInfo = new ClienteInfo(cli);
      // this.clienteInfo.maskAfiliado = 'AAA###AA#A';
    });
  }


  setDataSourceAttributes() {
    this.mtPreIncidentesServicios.paginator = this.paginator;
    this.mtPreIncidentesServicios.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }
    this.mtPreIncidentesServicios.filter = filterValue;
  }


  getPreIncidentesGenerales() {
    this.matTableLoadingService.activar();

    this.preincidentesClientesService
      .GetPreIncidentesGenerales(this.desde.value, this.hasta.value)
      .subscribe(data => {
        this.mtPreIncidentesServicios = new MatTableDataSource(data);
        this.setDataSourceAttributes();
        this.matTableLoadingService.desactivar();
        this.applyFilter(this.descripcionInput.value);
      },
        err => { this.matTableLoadingService.desactivar(); });
  }

  eliminarPreIncidentes(id: any) {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        title: 'Advertencia', content: 'Se borrara el preincidente. ¿Desea continuar?',
        yesText: 'Eliminar preincidente', noText: 'Cancelar'
      }
    }).afterClosed().subscribe(resultDialog => {
      if (resultDialog) {
        // this.preincidentesMovilesService.EliminarPreIncidentes(id).subscribe(result => { if (result == null) { this.loadData(); } });
      }
    });
  }

  openDialogCliente(Id: number = 0, estado: number = 1): void {
    let informacion: String;
    switch (estado) {
      case 1:
        informacion = 'La solicitud de servicio se encuentra pendiente de aprobación';
        break;
      case 2:
        informacion = 'La solicitud de servicio se encuentra rechazada';
        break;
      case 2:
        informacion = 'La solicitud de servicio se encuentra aprobada';
        break;
      default:
        break;
    }

    this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        title: 'Información', content: informacion,
        yesText: 'OK', noText: ''
      }
    }).afterClosed().subscribe(resultDialog => {
      if (resultDialog) {
        // this.preincidentesMovilesService.EliminarPreIncidentes(id).subscribe(result => { if (result == null) { this.loadData(); } });
      }
    });
  }


  verPreIncidentes(id: any, element: PreIncidentesServicios = null): void {

    const dialogRef = this.dialog.open(PreIncidentesDetailComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: { id: id, acceso: this.userAcceso, preincidente: element, clienteInfo: this.clienteInfo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.getPreIncidentesGenerales();
      }
    });
  }

  onMouseOver(element) {
    this.rowid = element.id; // this.mtBitacoras.data.findIndex(x => x.id == element.id);
    console.log(this.rowid);
  }
}
