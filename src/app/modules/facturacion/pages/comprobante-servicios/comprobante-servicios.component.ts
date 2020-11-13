import { FormControl } from '@angular/forms';
import { Component, ViewChild, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryComponent } from '@kolkov/ngx-gallery';

import { FacturacionService } from '../../facturacion.service';
import { ComprobanteServicio, ComprobanteServicioForExcel } from '../../models/comprobante-servicio';
import { CommonService } from '@app/modules/shared/services/common.service';
import { DownloadHelper } from '@app/modules/shared/helpers/download';
import { ServicioRenglonComponent } from '../servicio-renglones/servicio-renglones.component';
import { FileService } from '@app/modules/shared/services/files.service';
import { DescUrl } from '@app/models/DescUrl';
import { DialogComponent } from '@app/modules/shared/dialog/dialog.component';
import { DatePipe } from '@angular/common';
import { ProgressBarService } from '@app/modules/shared/services/progress-bar.service';

@Component({
  selector: 'app-comprobante-servicios',
  templateUrl: './comprobante-servicios.component.html',
  styleUrls: ['./comprobante-servicios.component.css']
})

export class ComprobanteServiciosComponent implements OnInit {
  descripcionInput: FormControl;
  isLoading = false;
  isDownloading = false;
  comprobanteId: number;
  dcComprobanteServicios: string[] = [
    'formatedFecha',
    'nroIncidente',
    'conceptoId',
    'nroInterno',
    'iva',
    'arba',
    'agip',
    'nroAfiliado',
    'formatedPaciente',
    'desde',
    'hasta',
    'kmt',
    'tpoEspera',
    'importeBase',
    'recargos',
    'importe',
    'viewFilesServicios',
    'calculo'
  ];
  mtComprobanteServicios: MatTableDataSource<ComprobanteServicio> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;

  allFilesUrl: DescUrl[];
  getRequests = [];

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChildren(NgxGalleryComponent) query: QueryList<NgxGalleryComponent>;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  messageError = ''; // no mostrar mensaje, Javi. 'Ocurrio un error al obtener los archivos de los siguiente servicios: ';
  constructor(
    private facturacionService: FacturacionService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private progressBarService: ProgressBarService
  ) {
    this.commonService.setTitulo('Servicios');
    activatedRoute.params.subscribe(params => {
      this.comprobanteId = parseFloat(params['comprobanteId']);
    });
  }

  ngOnInit() {
    this.descripcionInput = new FormControl();
    this.getComprobanteServicios();
  }

  setDataSourceAttributes() {
    this.mtComprobanteServicios.paginator = this.paginator;
    this.mtComprobanteServicios.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }
    this.mtComprobanteServicios.filter = filterValue;
  }

  getComprobanteServicios() {
    const datePipe = new DatePipe('en-US');
    this.allFilesUrl = [];
    const that = this;
    that.isLoading = true;
    that.facturacionService
      .getComprobanteServicios(this.comprobanteId)
      .subscribe(comprobanteServicios => {
        if (comprobanteServicios == null) {
          return;
        }
        comprobanteServicios.forEach(function (servicio) {
          servicio.galleryOptions = that.buildGalleryOptionsObject(servicio);
          servicio.galleryImages = new Array<NgxGalleryImage>();
          if (servicio.ordenesFiles) {
            servicio.servicioImagenes.forEach(function (servicioImagen) {
              servicio.galleryImages.push(that.buildGalleryImage(servicioImagen.fullPath));
              that.allFilesUrl.push(
                new DescUrl(
                  servicioImagen.fullPath,
                  `Incidente: ${servicio.nroIncidente}, Fecha: ${datePipe.transform(servicio.formatedFecha, 'dd/MM/yyyy')}`)
                  );
            });
          } else if (servicio.ordenPdfFullPath) {
            that.allFilesUrl.push(
              new DescUrl(
                servicio.ordenPdfFullPath,
                `Incidente: ${servicio.nroIncidente}, Fecha: ${datePipe.transform(servicio.formatedFecha, 'dd/MM/yyyy')}`)
                );
          }
        });
        that.isLoading = false;
        this.mtComprobanteServicios = new MatTableDataSource(comprobanteServicios);
        this.setDataSourceAttributes();
        this.applyFilter(this.descripcionInput.value);
      });
  }

  getComprobantePdf(documentoId: number) {
    this.facturacionService.getComprobantePdf(documentoId).subscribe(data => {
      if (data !== undefined) {
        const file = new Blob([data], { type: 'application/pdf' });

        // this.fileSharerService.savePdfFileSharer(file);

        // const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
      }
    });
  }

  shareComprobantePdf(documentoId: number) {
    this.facturacionService.getComprobantePdf(documentoId).subscribe(data => {
      if (data !== undefined) {
        this.fileService.saveBuffer(data, 'comprobante', FileService.PDF_TYPE );
        // const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
      }
    });
  }

  buildGalleryOptionsObject(servicio: ComprobanteServicio): NgxGalleryOptions[] {
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
            titleText: 'Descargar',
            onClick: function (event, index) {
              const a = document.createElement('a');
              a.href = this.galleryImages[index].medium;
              a.download = 'descarga_1';
              a.target = '_blank';
              document.body.appendChild(a);
              a.click();
            }.bind(servicio)
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

  openGallery(pIndex: any) {
    this.query.forEach(function (value, index, array) {
      if (pIndex === index) {
        value.openPreview(0);
      }
    });
  }

  openGalleryByElement(element: ComprobanteServicio) {
    let getImageOk = false;
    this.query.forEach(function (value, index, array) {
      if (element.galleryImages[0].big == value.bigImages[0]) {
        // si no refresca la imagen, modificar en: node_modules\@kolkov\ngx-gallery\__ivy_ngcc__\fesm5\kolkov-ngx-gallery.js
        // NgxGalleryPreviewComponent.prototype._show = function()
        // this.getSafeUrl(this.images[this.index]); ==> this.getSafeUrl(this.images[this.index] + '?time=' + new Date().getTime());
        // Si lo modificamos desde aca, falla la linea this.getFileType(this.images[this.index]);
        value.openPreview(0);
        getImageOk = true;
      }
    });
    if (!getImageOk) {
      this.openResultadoPdf(element.ordenPdfFullPath);
      this.commonService.showSnackBar('La imagen no se encontro');
    }
  }

  openResultadoPdf(fullPath: string) {
    window.open(fullPath + '?time=' + new Date().getTime(), '_blank');
  }

  verRenglones(servicioId: number, nroInterno: number) {
    this.dialog.open(ServicioRenglonComponent, {
      width: '95vw',
      maxWidth: '700px',
      data: { comprobaneId: this.comprobanteId, servicioId: servicioId, nroInterno: nroInterno }
    });
  }

  exportToExcel() {
    this.fileService.exportMatTable(new ComprobanteServicioForExcel(), this.mtComprobanteServicios, 'comprobanteServicios');
  }

  downloadAllImagesClient() {
    this.setIsLoading(true);
    DownloadHelper.setIsLoadingEvent.subscribe((event: boolean) => this.setIsLoading(false));

    DownloadHelper.downloadAllInZipV2(this.allFilesUrl, 'imagenes.zip', this.commonService, this.dialog, this.messageError);
  }

  downloadAllImagesServer() {
    this.setIsLoading(true);
    this.facturacionService
      .getComprobanteServiciosZip(this.comprobanteId)
      .subscribe(filesZipped => {
        this.setIsLoading(false);
        if (filesZipped) {
          filesZipped.errors = ''; // No mostrar errores, pedido de Javi.
          if (filesZipped.errors) {
            this.dialog.open(DialogComponent, {
              width: '350px',
              data: {
                title: 'Advertencia', content: '<p>' + this.messageError + '<br />'
                  + filesZipped.errors + '</p>',
                yesText: 'OK', noText: ''
              }
            }).afterClosed().subscribe(resultDialog => {
              saveAs(this.fileService.base64ToBlob(filesZipped.file, ''), 'imagenes.zip');
            });
          } else {
            saveAs(this.fileService.base64ToBlob(filesZipped.file, ''), 'imagenes.zip');
          }
        }
      });
    }

    setIsLoading(isDownloading: boolean, info = '' ) {
      if (isDownloading) {
        this.isDownloading = true;
        this.progressBarService.activarProgressBar(info);
      } else {
        this.isDownloading = false;
        this.progressBarService.desactivarProgressBar();
      }

    }
}
