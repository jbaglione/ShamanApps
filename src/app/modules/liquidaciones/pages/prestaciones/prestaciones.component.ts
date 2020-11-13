import { Component, ViewChild, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { LiquidacionesService } from '../../liquidaciones.service';
import { Incidentes, IncidentesForExcel } from '../../models/incidentes';
import { CommonService } from '@app/modules/shared/services/common.service';
import { FileService } from '@app/modules/shared/services/files.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryComponent } from '@kolkov/ngx-gallery';
import { DialogComponent } from '@app/modules/shared/dialog/dialog.component';
import { IncidenteDetalleComponent } from '../incidente-detalle/incidente-detalle.component';
import { RevisarPresentacionComponent } from '../revisar-presentacion/revisar-presentacion.component';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { FilterData } from '../../models/filter-data';
import { UploadResultadoHisopadoComponent } from '../../components/upload-resultado-hisopado/upload-resultado-hisopado.component';
import { UploadResultadoHisopadoDialogData } from '../../models/upload-resultado-hisopado-dialog-data.model';

@Component({
  selector: 'app-prestaciones',
  templateUrl: './prestaciones.component.html',
  styleUrls: ['./prestaciones.component.css']
})

export class PrestacionesComponent implements OnInit {

  userAcceso: number;
  isLoading = false;

  dcIncidentes: string[] = [
    'fecIncidente',
    'nroIncidente',
    'iva',
    'iibb',
    'nombre',
    'localidadDesde',
    'localidadHasta',
    'kilometros',
    'retorno',
    'turno',
    'tpoEspera',
    'conceptoFacturacionId',
    'coPago',
    'deriva',
    'importe',
    // 'flgCapitado',
    'rem',
    'conf'
    // 'rev',
  ];


  // esEmpresa: boolean;
  filterData: FilterData;

  mtIncidentes: MatTableDataSource<Incidentes> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;

  estadosDesc: any[] = [
    { descripcion: 'No conforme con los valores del servicio', icon: 'cancel_outline', color: 'warn' },
    { descripcion: 'Conforme con los valores del servicio', icon: 'check_circle_outline', color: 'success' },
    { descripcion: 'He recibido respuesta a mi reclamo', icon: 'error', color: 'oldGold' }, // A400
    { descripcion: 'Reclamo aceptado y se aplica la diferencia', icon: 'check_circle_outline', color: 'primary' },
    { descripcion: 'Reclamo no aceptado e importe no alterado', icon: 'cancel_outline', color: 'orange' },
  ];
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  @ViewChildren(NgxGalleryComponent) query: QueryList<NgxGalleryComponent>;

  @ViewChild('myInput')
  myFileInputVariable: ElementRef;


  @Input() esEmpresa: boolean;
  @Output() setIsLoadingEvent = new EventEmitter<boolean>();
  @Output() setIsWorkingEvent = new EventEmitter<boolean>();

  constructor(
    private liquidacionesService: LiquidacionesService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private fileService: FileService,
    private cd: ChangeDetectorRef,
    private authenticationService: AuthenticationService) {

    this.userAcceso = parseInt(this.authenticationService.currentAcceso.toString());
  }

  ngOnInit(): void {
    if (this.esEmpresa) {
      this.dcIncidentes.push('archivoOrden');
    }
  }

  setDataSourceAttributes() {
    this.mtIncidentes.paginator = this.paginator;
    this.mtIncidentes.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.mtIncidentes.filter = filterValue;
  }

  buildGalleryOptionsObject(incidente: Incidentes): NgxGalleryOptions[] {
    return [
      {
        image: false,
        thumbnails: false,
        width: '0px',
        height: '0px',
        previewDownload: false,
        previewZoom: true,
        previewRotate: true,
        previewSwipe: true,
        previewFullscreen: true,
        previewCloseOnEsc: true,
        previewKeyboardNavigation: true,
        previewBullets: true,
        previewZoomMax: 10,
        actions: [
          {
            icon: 'fa fa-download',
            disabled: false,
            titleText: 'Descarga',
            onClick: function (event, index) {
              const a = document.createElement('a');
              a.href = this.galleryImages[index].medium + '?time=' + new Date().getTime();
              a.download = 'descarga_1';
              a.target = '_blank';
              document.body.appendChild(a);
              a.click();
            }.bind(incidente)
          }
        ]
      }
    ];
  }

  buildGalleryImage(imageFullPath: string): NgxGalleryImage {
    return {
      small: imageFullPath,
      medium: imageFullPath,
      big: imageFullPath,
      description: ''
    };
  }

  // En desuso porque al usar gallery en una pestaña no se puede cerrar la preview.
  openGallery(pIndex: any) {
    this.query.forEach(function (value, index, array) {
      if (pIndex === index) {
        // si no refresca la imagen, modificar en: node_modules\@kolkov\ngx-gallery\__ivy_ngcc__\fesm5\kolkov-ngx-gallery.js
        // NgxGalleryPreviewComponent.prototype._show = function()
        // this.getSafeUrl(this.images[this.index]); ==> this.getSafeUrl(this.images[this.index] + '?time=' + new Date().getTime());
        // Si lo modificamos desde aca, falla la linea this.getFileType(this.images[this.index]);
        value.openPreview(0);
      }
    });
  }

  openImage(element: Incidentes) {
    window.open(element.galleryImages[0].big.toString() + '?time=' + new Date().getTime(), '_blank');
  }

  uploadResultadoHisopado(element: Incidentes) {

    let dialgoData = new UploadResultadoHisopadoDialogData();
    dialgoData.incidente = element;
    dialgoData.liquidacionId = this.filterData.pMov;
    const that = this;
    const dialogRef = this.dialog.open(UploadResultadoHisopadoComponent, {
      width: '95vw',
      maxWidth: '530px',
      data: dialgoData
    });

    dialogRef.componentInstance.setIsWorkingEvent.subscribe((isWorking: boolean) => {
      this.setIsWorkingEvent.emit(isWorking);
    });

    dialogRef.afterClosed().subscribe(incidente => {
      if (incidente != null) {
        // this.getData();
        this.updateStateOrderInIncidente(element, incidente, that);
      }
    });
  }

  getData(filterData: FilterData = this.filterData) {
    this.filterData = filterData;
    const that = this;
    that.isLoading = true;
    this.mtIncidentes = new MatTableDataSource([]);
    that.liquidacionesService
      .getIncidentes(filterData.pMov, filterData.pPer, filterData.pDia, filterData.pEst)
      .subscribe(incidentes => {
        that.isLoading = false;
        that.setIsLoadingEvent.emit(false);

        if (incidentes == null) {
          return;
        }
        incidentes.forEach(function (incidente) {
          incidente.galleryOptions = that.buildGalleryOptionsObject(incidente);
          incidente.galleryImages = new Array<NgxGalleryImage>();
          if (incidente.ordenImagenes) {
            incidente.ordenImagenes.forEach(function (ordenImagen) {
              incidente.galleryImages.push(
                that.buildGalleryImage(ordenImagen.fullPath)
              );
            });
          }
        });

        this.mtIncidentes = new MatTableDataSource(incidentes);
        this.applyFilter(filterData.buscar);
        this.setDataSourceAttributes();
      }, err => {
        that.isLoading = false;
        that.setIsLoadingEvent.emit(false);
      });
  }

  eliminarAdjuntoActual(element: Incidentes) {

    this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        title: 'Advertencia', content: 'Se borrara la orden adjunta definitivamente. ¿Desea continuar?',
        yesText: 'Eliminar orden', noText: 'Cancelar'
      }
    }).afterClosed().subscribe(resultDialog => {
      if (resultDialog) {
        this.setIsWorkingEvent.emit(true);
        this.liquidacionesService.eliminarOrdenServicio(element.incidenteId, element.archivoOrden).subscribe(isOk => {
          this.setIsWorkingEvent.emit(false);
          if (isOk) {
            element.archivoOrden = null;
            element.ordenImagenes = [];
            element.rem = 'NO';
            this.commonService.showSnackBarSucces('La orden se elimino correctamente.');
          } else {
            this.commonService.showSnackBarFatal('Hubo un inconveniente, intente mas tarde.');
            this.getData();
          }
        });
      }
    });
  }

  onFileChange(event, element: Incidentes) {
    const reader = new FileReader();
    const that = this;

    if (event.target.files && event.target.files.length) {
      if (event.target.files[0].type != 'image/jpeg') {
        this.commonService.showSnackBar(event.target.files[0].name + ' no es una imagen valida');
        event.target.files = null;
        this.myFileInputVariable.nativeElement.value = '';
        this.cd.markForCheck();
        return;
      }
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.setIsWorkingEvent.emit(true);
      this.liquidacionesService.uploadOrdenServicio(element.archivoOrden, this.filterData.pMov,
        element.incidenteId, file).subscribe(data => {
          this.setIsWorkingEvent.emit(false);
          if (data) {
            this.updateStateOrderInIncidente(element, data, that);
            this.commonService.showSnackBarSucces('La orden se adjunto correctamente.');
          } else {
            event.target.files = null;
            this.myFileInputVariable.nativeElement.value = '';
            this.cd.markForCheck();
          }
        });
    }
  }

  private updateStateOrderInIncidente(element: Incidentes, data: Incidentes, that: this) {
    element.rem = data.rem;
    element.archivoOrden = data.archivoOrden;
    element.ordenImagenes = data.ordenImagenes;
    element.galleryOptions = this.buildGalleryOptionsObject(element);
    element.galleryImages = new Array<NgxGalleryImage>();
    if (element.ordenImagenes) {
      element.ordenImagenes.forEach(function (ordenImagen) {
        element.galleryImages.push(
          that.buildGalleryImage(ordenImagen.fullPath)
        );
      });
    }
    this.setDataSourceAttributes();
  }

  // POPUP DETALLE
  detalle(element: Incidentes) {
    const dialogRef = this.dialog.open(IncidenteDetalleComponent, {
      width: '95vw',
      maxWidth: '600px',
      data: { pItmLiq: element.id, pLiqId: this.filterData.pMov, pInc: element.incidenteId }
    });
  }

  // POPUP REVISAR
  revisar(element: Incidentes) {
    const dialogRef = this.dialog.open(RevisarPresentacionComponent, {
      width: '95vw',
      maxWidth: '600px',
      data: { element: element, esEmpresa: this.esEmpresa }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'updated') {
        this.getData();
      }
    });
  }

  exportToExcel() {
    this.fileService.exportMatTable(new IncidentesForExcel(), this.mtIncidentes, 'prestaciones');
  }

}
