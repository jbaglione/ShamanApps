import { FormControl } from '@angular/forms';
import { Component, ViewChild, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator, MatButton } from '@angular/material';

import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryComponent } from 'ngx-gallery';

import { FacturacionService } from '../../facturacion.service';
import { ComprobanteServicio, ComprobanteServicioForExcel } from '../../models/comprobante-servicio';
import { CommonService } from '@app/services/common.service';
import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';
import { DownloadHelper } from '@app/modules/shared/helpers/download';
import { ServicioRenglonComponent } from '../servicio-renglones/servicio-renglones.component';


@Component({
  selector: 'app-comprobante-servicios',
  templateUrl: './comprobante-servicios.component.html',
  styleUrls: ['./comprobante-servicios.component.css']
})

export class ComprobanteServiciosComponent implements OnInit {
  descripcionInput: FormControl;
  isLoading: Boolean = false;
  isDownloading: Boolean = false;
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
    'verImagenesServicios',
    'calculo'
  ];
  mtComprobanteServicios: MatTableDataSource<ComprobanteServicio> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;

  allImagesUrl: string[];
  getRequests = [];

  @ViewChild(MatSort, {static: false}) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChildren(NgxGalleryComponent) query: QueryList<NgxGalleryComponent>;

  @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    private facturacionService: FacturacionService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
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
    if (filterValue != null && filterValue != '') {
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.mtComprobanteServicios.filter = filterValue;
    }
  }

  getComprobanteServicios() {
    this.allImagesUrl = [];
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
          servicio.servicioImagenes.forEach(function (servicioImagen) {
            servicio.galleryImages.push(that.buildGalleryImage(servicioImagen.fullPath));
            that.allImagesUrl.push(servicioImagen.fullPath);
          });
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
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
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

  verRenglones(servicioId: number, nroInterno: number) {

    const dialogRef = this.dialog.open(ServicioRenglonComponent, {
      width: '95vw',
      maxWidth: '700px',
      data: { comprobaneId: this.comprobanteId, servicioId: servicioId, nroInterno: nroInterno }
    });
  }

  exportToExcel() {
    ExportMatTableToXlxs.export(new ComprobanteServicioForExcel(), this.mtComprobanteServicios, 'comprobanteServicios', this.commonService);
  }

  downloadAllImages() {
    DownloadHelper.downloadAllInZip(this.allImagesUrl, 'imagenes.zip', this.commonService);
  }

}
